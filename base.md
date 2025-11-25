import React, { useState } from 'react';
import { Menu, X, Github, Linkedin, Mail, ExternalLink, Smartphone, Database, Code, GitBranch, Terminal, Layers, Download, Send, CheckCircle2 } from 'lucide-react';

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  // Data Mockup diperbarui dengan detail lengkap
  const skills = [
    { name: 'Flutter', type: 'UI Toolkit', icon: <Smartphone className="w-8 h-8 text-blue-400" /> },
    { name: 'Dart', type: 'Language', icon: <Code className="w-8 h-8 text-blue-300" /> },
    { name: 'Firebase', type: 'Backend', icon: <Database className="w-8 h-8 text-yellow-500" /> },
    { name: 'Git', type: 'Version Control', icon: <GitBranch className="w-8 h-8 text-red-500" /> },
    { name: 'Android Studio', type: 'IDE', icon: <Layers className="w-8 h-8 text-green-400" /> },
    { name: 'VS Code', type: 'Editor', icon: <Terminal className="w-8 h-8 text-blue-500" /> },
  ];

  const projects = [
    {
      title: 'FinTrack - Aplikasi Keuangan',
      description: 'Aplikasi mobile untuk membantu pengguna melacak pendapatan dan pengeluaran dengan fitur analitik detail.',
      longDescription: 'FinTrack adalah solusi manajemen keuangan pribadi yang komprehensif. Dibangun dengan Flutter untuk performa native yang mulus, aplikasi ini memungkinkan pengguna untuk mencatat transaksi harian, memvisualisasikan arus kas dengan grafik interaktif, dan menetapkan anggaran bulanan agar tetap pada jalurnya. Sinkronisasi cloud memastikan data Anda aman dan dapat diakses dari perangkat mana pun.',
      features: [
        'Pencatatan Transaksi Multi-kategori',
        'Visualisasi Data dengan Grafik & Diagram',
        'Perencanaan & Peringatan Anggaran',
        'Mode Gelap & Terang',
        'Ekspor Laporan ke PDF/Excel'
      ],
      tags: ['Flutter', 'Firebase Auth', 'Firestore', 'Dart', 'Provider', 'Fl_Chart'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      link: '#',
      github: '#'
    },
    {
      title: 'ConnectSphere - Sosmed Pro',
      description: 'Platform jejaring sosial bagi para profesional untuk terhubung dan berbagi ide dalam industri mereka.',
      longDescription: 'ConnectSphere dirancang untuk menjembatani kesenjangan antara profesional di berbagai industri. Berbeda dengan media sosial biasa, algoritma kami memprioritaskan konten yang relevan dengan karir dan peluang kolaborasi. Aplikasi ini menggunakan arsitektur clean code untuk memastikan skalabilitas dan kemudahan pemeliharaan.',
      features: [
        'Feed Berita Terkurasi AI',
        'Sistem Chat Real-time (WebSocket)',
        'Pembuatan Profil Profesional',
        'Pencarian Lowongan Kerja & Mentor',
        'Notifikasi Push'
      ],
      tags: ['Flutter', 'Node.js', 'MongoDB', 'Socket.io', 'GetX State Management'],
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      link: '#',
      github: '#'
    },
    {
      title: 'TravelGo - Booking App',
      description: 'Aplikasi pemesanan tiket perjalanan dan hotel dengan integrasi peta real-time.',
      longDescription: 'TravelGo memudahkan perencanaan liburan Anda. Dari pemesanan tiket pesawat hingga reservasi hotel, semuanya ada dalam satu aplikasi. Integrasi Google Maps memungkinkan pengguna melihat lokasi hotel dan atraksi wisata di sekitarnya secara langsung. Sistem pembayaran yang aman dan dukungan multi-bahasa menjadikannya teman perjalanan yang sempurna.',
      features: [
        'Pencarian & Filter Tingkat Lanjut',
        'Integrasi Google Maps API',
        'Gateway Pembayaran Aman (Stripe/Midtrans)',
        'Ulasan & Rating Pengguna',
        'Dukungan Multi-bahasa (i18n)'
      ],
      tags: ['Flutter', 'Google Maps API', 'Rest API', 'BLoC Pattern', 'Stripe SDK'],
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      link: '#',
      github: '#'
    }
  ];

  const experiences = [
    {
      year: '2021 - Sekarang',
      role: 'Senior Flutter Developer',
      company: 'Tech Innovations Inc.',
      desc: 'Memimpin pengembangan tujuh aplikasi mobile high-profile, mementori developer junior, dan meningkatkan performa aplikasi sebesar 30%.'
    },
    {
      year: '2019 - 2021',
      role: 'Mobile App Developer',
      company: 'Mobile Solutions Co.',
      desc: 'Mengembangkan dan memelihara aplikasi lintas platform menggunakan Flutter, berkontribusi pada peningkatan 50% dalam keterlibatan pengguna.'
    },
    {
      year: '2017 - 2019',
      role: 'Junior Developer',
      company: 'Startup Bright',
      desc: 'Bekerja pada front-end berbagai proyek mobile, mendapatkan pengalaman fundamental dalam Dart dan framework Flutter.'
    }
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-40 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 font-bold text-2xl text-blue-500 tracking-wider">
              ALEX<span className="text-white">DEV.</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {['Tentang', 'Tools', 'Proyek', 'Pengalaman', 'Kontak'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                  >
                    {item}
                  </button>
                ))}
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all hover:scale-105">
                  <Download size={16} />
                  Unduh CV
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-gray-300 hover:text-white p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-b border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {['Tentang', 'Tools', 'Proyek', 'Pengalaman', 'Kontak'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="tentang" className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
            <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
              <h2 className="text-blue-500 font-semibold tracking-wide uppercase text-sm">Mobile App Developer</h2>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
                Halo, Saya Alex Doe,<br />
                <span className="text-blue-500">Flutter Specialist</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto md:mx-0">
                Saya membangun aplikasi mobile yang indah, responsif, dan performa tinggi untuk iOS dan Android. Mari ciptakan sesuatu yang luar biasa bersama.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <button onClick={() => scrollToSection('proyek')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30">
                  Lihat Karya Saya
                </button>
                <button onClick={() => scrollToSection('kontak')} className="border border-gray-600 hover:border-blue-500 hover:text-blue-400 text-gray-300 px-8 py-3 rounded-lg font-semibold transition-all">
                  Hubungi Saya
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-6 opacity-20 blur-lg"></div>
                <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-3xl overflow-hidden border-4 border-gray-800 shadow-2xl">
                   {/* Placeholder Image for Developer */}
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Developer Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools & Tech Section */}
      <section id="tools" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12">Tools & Teknologi</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {skills.map((skill, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all hover:-translate-y-1 group">
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>
                <h3 className="font-bold text-white">{skill.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{skill.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="proyek" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12">Proyek Terselesaikan</h2>
          <p className="text-gray-400 mb-8 -mt-8">Klik pada kartu proyek untuk melihat detail lengkap.</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedProject(project)}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300 group cursor-pointer transform hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    Klik untuk detail
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span key={tagIndex} className="bg-blue-900/30 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-900/50">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full border border-gray-700">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4 pt-4 border-t border-gray-700">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.link, '_blank');
                      }} 
                      className="flex items-center gap-2 text-sm text-white hover:text-blue-400 transition-colors"
                    >
                      <ExternalLink size={16} /> Website
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.github, '_blank');
                      }} 
                      className="flex items-center gap-2 text-sm text-white hover:text-blue-400 transition-colors"
                    >
                      <Github size={16} /> GitHub
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProject(null)} 
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-red-500/80 rounded-full text-white transition-all backdrop-blur"
            >
              <X size={24} />
            </button>

            {/* Modal Image */}
            <div className="relative h-64 sm:h-80 w-full">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
              <h3 className="absolute bottom-6 left-6 text-3xl md:text-4xl font-bold text-white shadow-black drop-shadow-lg">
                {selectedProject.title}
              </h3>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Description */}
              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <Smartphone size={20} /> Tentang Aplikasi
                </h4>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {selectedProject.longDescription}
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                  <Code size={20} /> Teknologi yang Digunakan
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, idx) => (
                    <span key={idx} className="bg-blue-900/20 text-blue-300 px-4 py-2 rounded-lg border border-blue-900/50 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features List */}
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-green-500" /> Fitur Utama
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedProject.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-gray-300">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5 shrink-0"></span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-800">
                <a 
                  href={selectedProject.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-center transition-all hover:shadow-lg hover:shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  <ExternalLink size={20} /> Kunjungi Website / Demo
                </a>
                <a 
                  href={selectedProject.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3.5 rounded-xl text-center transition-all border border-gray-700 flex items-center justify-center gap-2"
                >
                  <Github size={20} /> Lihat Source Code
                </a>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Experience Section */}
      <section id="pengalaman" className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12">Pengalaman Kerja</h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-500 before:to-transparent">
            {experiences.map((exp, index) => (
              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                {/* Timeline Dot */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-700 bg-gray-900 group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-blue-900/20">
                  <div className="w-3 h-3 bg-blue-500 rounded-full group-hover:bg-white transition-colors"></div>
                </div>
                
                {/* Content Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-gray-700 bg-gray-800 hover:border-blue-500 transition-all shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h3 className="font-bold text-white text-lg">{exp.role}</h3>
                    <span className="text-blue-400 text-sm font-mono mt-1 sm:mt-0">{exp.year}</span>
                  </div>
                  <div className="text-blue-300 font-medium mb-3">{exp.company}</div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {exp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontak" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Get In Touch</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Saya saat ini terbuka untuk peluang baru dan kolaborasi. Jangan ragu untuk menghubungi saya melalui salah satu platform di bawah ini.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Email Card */}
            <a 
              href="mailto:alex.doe@example.com" 
              className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all group flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/20"
            >
              <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors shadow-lg border border-gray-700 group-hover:border-blue-500">
                <Mail className="w-10 h-10 text-blue-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Email</h3>
              <p className="text-gray-400 group-hover:text-blue-300 transition-colors font-medium">alex.doe@example.com</p>
              <span className="text-sm text-gray-500 mt-4 group-hover:text-gray-300">Kirim Pesan &rarr;</span>
            </a>

            {/* LinkedIn Card */}
            <a 
              href="https://linkedin.com/in/alexdoe" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all group flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/20"
            >
              <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors shadow-lg border border-gray-700 group-hover:border-blue-500">
                <Linkedin className="w-10 h-10 text-blue-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2">LinkedIn</h3>
              <p className="text-gray-400 group-hover:text-blue-300 transition-colors font-medium">linkedin.com/in/alexdoe</p>
              <span className="text-sm text-gray-500 mt-4 group-hover:text-gray-300">Terhubung &rarr;</span>
            </a>

            {/* GitHub Card */}
            <a 
              href="https://github.com/alexdoe" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all group flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/20"
            >
              <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors shadow-lg border border-gray-700 group-hover:border-blue-500">
                <Github className="w-10 h-10 text-blue-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2">GitHub</h3>
              <p className="text-gray-400 group-hover:text-blue-300 transition-colors font-medium">github.com/alexdoe</p>
              <span className="text-sm text-gray-500 mt-4 group-hover:text-gray-300">Lihat Repositori &rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            &copy; 2024 Alex Doe. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github size={20} /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Mail size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;