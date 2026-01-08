<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface ImageEditorProps {
  src: string;
  currentWidth?: string | number;
  currentHeight?: string | number;
  currentRotation?: number;
  currentAlign?: 'left' | 'center' | 'right';
  currentBorder?: boolean;
  currentShadow?: boolean;
  currentCaption?: string;
}

const props = defineProps<ImageEditorProps>();

const emit = defineEmits<{
  (e: 'apply', config: ImageConfig): void;
  (e: 'cancel'): void;
}>();

interface ImageConfig {
  width?: string | number;
  height?: string | number;
  rotation: number;
  align: 'left' | 'center' | 'right';
  border: boolean;
  shadow: boolean;
  caption: string;
}

// Form state
const width = ref<string | number>(props.currentWidth || 'auto');
const height = ref<string | number>(props.currentHeight || 'auto');
const rotation = ref(props.currentRotation || 0);
const align = ref(props.currentAlign || 'center');
const lockAspectRatio = ref(true);
const border = ref(props.currentBorder || false);
const shadow = ref(props.currentShadow || false);
const caption = ref(props.currentCaption || '');

// Original dimensions (for aspect ratio calculation)
const originalWidth = ref<number>(0);
const originalHeight = ref<number>(0);
const aspectRatio = ref<number>(1);

// Load image to get original dimensions
const imgElement = ref<HTMLImageElement | null>(null);

watch(
  () => props.src,
  (newSrc) => {
    if (newSrc) {
      const img = new Image();
      img.onload = () => {
        originalWidth.value = img.naturalWidth;
        originalHeight.value = img.naturalHeight;
        aspectRatio.value = img.naturalWidth / img.naturalHeight;

        // Set initial dimensions if not provided
        if (props.currentWidth === undefined || props.currentWidth === 'auto') {
          width.value = img.naturalWidth;
        }
        if (props.currentHeight === undefined || props.currentHeight === 'auto') {
          height.value = img.naturalHeight;
        }
      };
      img.src = newSrc;
    }
  },
  { immediate: true },
);

// Aspect ratio lock behavior
const onWidthChange = (newWidth: string | number | null) => {
  if (lockAspectRatio.value && aspectRatio.value > 0 && newWidth !== null) {
    const numWidth = typeof newWidth === 'string' ? parseFloat(newWidth) : newWidth;
    if (!isNaN(numWidth)) {
      height.value = Math.round(numWidth / aspectRatio.value);
    }
  }
};

const onHeightChange = (newHeight: string | number | null) => {
  if (lockAspectRatio.value && aspectRatio.value > 0 && newHeight !== null) {
    const numHeight = typeof newHeight === 'string' ? parseFloat(newHeight) : newHeight;
    if (!isNaN(numHeight)) {
      width.value = Math.round(numHeight * aspectRatio.value);
    }
  }
};

// Rotation controls
const rotate = (degrees: number) => {
  rotation.value = (rotation.value + degrees) % 360;
};

// Preview style
const previewStyle = computed(() => {
  const styles: Record<string, string> = {
    transform: `rotate(${rotation.value}deg)`,
    maxWidth: '100%',
    maxHeight: '400px',
  };

  if (width.value !== 'auto') {
    styles.width = typeof width.value === 'number' ? `${width.value}px` : width.value;
  }
  if (height.value !== 'auto') {
    styles.height = typeof height.value === 'number' ? `${height.value}px` : height.value;
  }

  if (border.value) {
    styles.border = '2px solid #d4d4d8';
    styles.borderRadius = '8px';
  }

  if (shadow.value) {
    styles.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
  }

  return styles;
});

const previewContainerStyle = computed(() => {
  const styles: Record<string, string> = {
    display: 'flex',
    justifyContent:
      align.value === 'left' ? 'flex-start' : align.value === 'right' ? 'flex-end' : 'center',
  };
  return styles;
});

// Apply changes
const apply = () => {
  emit('apply', {
    width: width.value,
    height: height.value,
    rotation: rotation.value,
    align: align.value,
    border: border.value,
    shadow: shadow.value,
    caption: caption.value,
  });
};

const cancel = () => {
  emit('cancel');
};
</script>

<template>
  <q-dialog :model-value="true" @update:model-value="cancel">
    <q-card style="min-width: 600px; max-width: 800px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Edit Image</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="cancel" />
      </q-card-section>

      <q-card-section>
        <!-- Image Preview -->
        <div
          class="q-mb-md bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4"
          :style="previewContainerStyle"
        >
          <img :src="src" :style="previewStyle" ref="imgElement" alt="Preview" />
        </div>

        <!-- Caption -->
        <q-input v-model="caption" label="Caption (optional)" outlined dense class="q-mb-md" />

        <!-- Size Controls -->
        <div class="text-subtitle2 q-mb-sm">Size</div>
        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-5">
            <q-input
              v-model.number="width"
              label="Width (px)"
              type="number"
              outlined
              dense
              @update:model-value="onWidthChange"
            />
          </div>
          <div class="col-5">
            <q-input
              v-model.number="height"
              label="Height (px)"
              type="number"
              outlined
              dense
              @update:model-value="onHeightChange"
            />
          </div>
          <div class="col-2 flex items-center">
            <q-toggle
              v-model="lockAspectRatio"
              :icon="lockAspectRatio ? 'lock' : 'lock_open'"
              color="primary"
              size="sm"
            />
          </div>
        </div>

        <!-- Rotation Controls -->
        <div class="text-subtitle2 q-mb-sm">Rotation</div>
        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col">
            <q-btn
              label="⤺ 90°"
              outline
              color="primary"
              size="sm"
              class="full-width"
              @click="rotate(-90)"
            />
          </div>
          <div class="col">
            <q-btn
              label="⤼ 90°"
              outline
              color="primary"
              size="sm"
              class="full-width"
              @click="rotate(90)"
            />
          </div>
          <div class="col">
            <q-btn
              label="180°"
              outline
              color="primary"
              size="sm"
              class="full-width"
              @click="rotate(180)"
            />
          </div>
          <div class="col">
            <q-slider v-model="rotation" :min="0" :max="359" label label-always class="q-mt-md" />
          </div>
        </div>

        <!-- Alignment -->
        <div class="text-subtitle2 q-mb-sm">Alignment</div>
        <q-btn-toggle
          v-model="align"
          toggle-color="primary"
          :options="[
            { label: 'Left', value: 'left', icon: 'format_align_left' },
            { label: 'Center', value: 'center', icon: 'format_align_center' },
            { label: 'Right', value: 'right', icon: 'format_align_right' },
          ]"
          class="q-mb-md"
          outline
          size="sm"
        />

        <!-- Format Options -->
        <div class="text-subtitle2 q-mb-sm">Format</div>
        <div class="row q-col-gutter-sm">
          <div class="col">
            <q-checkbox v-model="border" label="Border" />
          </div>
          <div class="col">
            <q-checkbox v-model="shadow" label="Shadow" />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="grey" @click="cancel" />
        <q-btn unelevated label="Apply" color="primary" @click="apply" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.rounded-lg {
  border-radius: 0.5rem;
}

.p-4 {
  padding: 1rem;
}

.bg-zinc-100 {
  background-color: #f4f4f5;
}

.dark .dark\:bg-zinc-800 {
  background-color: #27272a;
}
</style>
