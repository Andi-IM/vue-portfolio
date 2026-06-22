/**
 * Migration Script: KV to D1
 *
 * One-time script to migrate existing data from Workers KV to D1 database.
 *
 * Usage:
 *   1. Set up wrangler with both KV and D1 bindings
 *   2. Run: npx wrangler d1 execute blog-portfolio --file=migrations/0001_schema.sql
 *   3. Run: node scripts/migrate-kv-to-d1.mjs
 *
 * Note: This script uses Wrangler's local bindings for development.
 * For production migration, use Wrangler's remote flag.
 */

import { execSync } from 'child_process';

// Configuration
const KV_NAMESPACE_ID = 'a3a278151de1448aa7ab4c730a5d04fc';
const D1_DATABASE_NAME = 'blog-portfolio';

async function main() {
  console.log('=== KV to D1 Migration Script ===\n');

  // Step 1: Export posts_index from KV
  console.log('1. Fetching posts_index from KV...');

  let postsIndex;
  try {
    const result = execSync(
      `npx wrangler kv key get posts_index --namespace-id=${KV_NAMESPACE_ID} --text`,
      { encoding: 'utf-8' },
    );
    postsIndex = JSON.parse(result);
    console.log(`   Found ${postsIndex.length} posts in index\n`);
  } catch {
    console.log('   No posts_index found or empty. Nothing to migrate.\n');
    return;
  }

  // Step 2: Migrate each post
  console.log('2. Migrating posts to D1...');

  for (const postMeta of postsIndex) {
    try {
      // Fetch full post from KV
      const postJson = execSync(
        `npx wrangler kv key get "${postMeta.id}" --namespace-id=${KV_NAMESPACE_ID} --text`,
        { encoding: 'utf-8' },
      );
      const post = JSON.parse(postJson);

      // Insert into D1
      const sql = `
        INSERT OR REPLACE INTO posts (id, title, slug, excerpt, content, cover_image, created_at, updated_at)
        VALUES ('${escape(post.id)}', '${escape(post.title)}', '${escape(post.slug)}',
                '${escape(post.excerpt || '')}', '${escape(post.content || '')}',
                '${escape(post.coverImage || '')}', '${escape(post.createdAt)}', '${escape(post.updatedAt)}')
      `;

      execSync(
        `npx wrangler d1 execute ${D1_DATABASE_NAME} --command="${sql.replace(/\n/g, ' ')}"`,
        {
          encoding: 'utf-8',
        },
      );

      console.log(`   ✓ Migrated post: ${post.title}`);

      // Initialize views
      execSync(
        `npx wrangler d1 execute ${D1_DATABASE_NAME} --command="INSERT OR IGNORE INTO views (post_id, count) VALUES ('${post.id}', 0)"`,
        { encoding: 'utf-8' },
      );
    } catch (e) {
      console.error(`   ✗ Failed to migrate post ${postMeta.id}:`, e.message);
    }
  }

  // Step 3: Migrate views
  console.log('\n3. Migrating view counts...');

  for (const postMeta of postsIndex) {
    try {
      const viewsResult = execSync(
        `npx wrangler kv key get "views:${postMeta.id}" --namespace-id=${KV_NAMESPACE_ID} --text`,
        { encoding: 'utf-8' },
      );
      const count = parseInt(viewsResult, 10) || 0;

      if (count > 0) {
        execSync(
          `npx wrangler d1 execute ${D1_DATABASE_NAME} --command="UPDATE views SET count = ${count} WHERE post_id = '${postMeta.id}'"`,
          { encoding: 'utf-8' },
        );
        console.log(`   ✓ Migrated views for ${postMeta.id}: ${count}`);
      }
    } catch {
      // No views for this post, skip
    }
  }

  console.log('\n=== Migration Complete ===');
  console.log('\nNext steps:');
  console.log(
    '1. Verify data: npx wrangler d1 execute blog-portfolio --command="SELECT * FROM posts"',
  );
  console.log('2. Test locally: bun run dev:wrangler');
  console.log('3. Deploy: npx wrangler pages deploy');
}

function escape(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/'/g, "''");
}

main().catch(console.error);
