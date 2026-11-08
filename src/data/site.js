/**
 * Everything about you: edit the values, the home page updates.
 * Text fields accept simple html (<strong>, <em>, <a>) where noted.
 */

export const site = {
  // <title>, social previews
  title: 'Olivier Langelier-Mainville, Creative Developer',
  description:
    'Portfolio of Olivier Langelier-Mainville, a creative developer building websites and interactive experiences.',
  // Social preview image: a file in public/ (1200x630), ex: '/og.jpg'. `null` for none
  ogImage: null
};

export const profile = {
  name: 'Olivier Langelier-Mainville',
  // The big name across the hero on desktop
  displayName: 'Olivier-LM',
  // Logo in the nav, and the letters stacked in the hero on mobile
  initials: 'OLM',
  // The ` + ` splits it on 3 lines on mobile
  role: 'Creative dev + aspiring designer',
  intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  location: 'Montréal',
  // Time zone of the clock next to the location
  timeZone: 'America/Toronto',
  email: 'hello@example.com'
};

// Work section, the projects themselves are in src/data/projects.js
export const work = {
  title: 'Featured Projects',
  // The column labels, in order. Mobile only shows the name and index
  columns: { index: 'Index', name: 'Name', info: 'Info', media: 'Media' },
  // Under a project's media on mobile, when there's more than one
  swipeLabel: 'Swipe'
};

// The info list of a project or trial
export const projectInfo = {
  linkLabel: 'Link',
  stackLabel: 'Stack',
  yearLabel: 'Year',
  visitLabel: 'Visit'
};

// The full size view of a project's or trial's media, opened by clicking one
export const mediaViewer = {
  // Read by screen readers on each media, followed by its alt
  openLabel: 'View full size',
  closeLabel: 'Close',
  previousLabel: 'Previous',
  nextLabel: 'Next'
};

// About section
export const about = {
  greeting: 'Hi, I’m',
  role: 'Front-end developer',
  // Very large word behind the portrait, seen while it's narrow
  title: 'About',
  // A file in public/ or an imported file (see src/data/projects.js), `null` shows a grey placeholder
  portrait: '/me.png',
  education: { degree: 'Computer science bachelor degree', school: 'University of Montreal' },
  // Short texts side by side under the portrait
  blocks: [
    {
      title: 'Goal',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue.'
    },
    {
      title: 'Passion',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue.'
    }
  ]
};

// Contact section: the email and socials side by side, the title very large on one line under them
export const contact = {
  title: "Let's talk",
  // Short line above the email, `null` to hide it
  status: 'Available for work',
  statusLabel: 'Status',
  emailLabel: 'Email',
  locationLabel: 'Local time',
  writeLabel: 'Write me',
  copyLabel: 'Copy',
  copiedLabel: 'Copied',
  socialsLabel: 'Socials',
  newWindowLabel: '(opens in a new window)',
  backToTop: 'Back to top'
};

// Contact links. `icon` is a file name in src/assets/icons (optional)
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

// Theme toggle in the nav: its label, and the name of each theme (the current one is shown)
export const theme = {
  label: 'Theme',
  dark: 'Dark',
  light: 'Light'
};

// Language picker in the nav. Not wired to anything yet: the site has a single language
export const languages = {
  label: 'Language',
  options: [
    { label: 'English', value: 'en' },
    { label: 'Français', value: 'fr' }
  ]
};
