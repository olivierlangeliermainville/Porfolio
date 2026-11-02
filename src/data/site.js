/**
 * Everything about you: edit the values, the home page updates.
 * Text fields accept simple html (<strong>, <em>, <a>) where noted.
 */

export const site = {
  // <title>, social previews
  title: 'Your Name, Creative Developer',
  description: 'Portfolio of Your Name, a creative developer building websites and interactive experiences.',
  // Social preview image: a file in public/ (1200x630), ex: '/og.jpg'. `null` for none
  ogImage: null
};

export const profile = {
  name: 'Your Name',
  role: 'Creative developer',
  location: 'Montréal, QC',
  // Shown next to a green dot in the hero, `null` to hide it
  availability: 'Available for freelance from January',
  // Hero headline, html allowed
  headline: 'I build websites that <em>move</em>.',
  intro: 'Front-end developer working with design teams on marketing sites, campaigns and interactive pieces.',
  email: 'hello@example.com'
};

// About section, one string per paragraph (html allowed)
export const about = {
  title: 'About',
  paragraphs: [
    'I’ve spent the last few years turning designs into fast, accessible and animated websites, mostly with <strong>Vue</strong>, <strong>Nuxt</strong> and <strong>Astro</strong>.',
    'I care about the details: motion that feels right, type that scales, and code the next person can read.'
  ],
  // Listed as tags under the text
  skills: ['Astro', 'Vue', 'Nuxt', 'Tailwind CSS', 'GSAP', 'WebGL', 'Headless CMS', 'Accessibility']
};

// Experience list in the about section, most recent first. `to` is optional
export const experience = [
  { company: 'Studio Name', role: 'Senior developer', period: '2023 — now', to: 'https://example.com' },
  { company: 'Agency Name', role: 'Front-end developer', period: '2020 — 2023' },
  { company: 'Freelance', role: 'Developer', period: '2018 — 2020' }
];

// Footer and contact links. `icon` is a file name in src/assets/icons (optional)
export const socials = [
  { label: 'LinkedIn', to: 'https://www.linkedin.com/in/your-name', icon: 'social-linkedin' },
  { label: 'Instagram', to: 'https://www.instagram.com/your-name', icon: 'social-instagram' },
  { label: 'GitHub', to: 'https://github.com/your-name' }
];

// Nav links, anchors to the sections of the home page
export const nav = [
  { label: 'Work', to: '#work' },
  { label: 'About', to: '#about' },
  { label: 'Contact', to: '#contact' }
];
