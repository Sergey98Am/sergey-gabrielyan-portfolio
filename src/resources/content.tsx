import { About, Home, Person, Social, Work } from "@/types";
import { Logo } from "@once-ui-system/core";

const person: Person = {
  firstName: "Sergey",
  lastName: "Gabrielyan",
  name: `Sergey Gabrielyan`,
  role: "Drupal Developer",
  avatar: "/images/avatar.jpg",
  email: "sergey.gabrielyan1998@gmail.com",
  location: "Asia/Yerevan", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Armenian"], // optional: Leave the array empty if you don't want to display languages
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/sergey-gabrielyan/",
  },
  {
    name: "Drupal",
    icon: "drupal",
    link: "https://www.drupal.org/u/sergey_gabrielyan",
  },
  {
    name: "GitLab",
    icon: "gitlab",
    link: "https://gitlab.com/dashboard/projects",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Creating maintainable Drupal solutions</>,
  subline: (
      <>
          I’m Sergey, a Drupal Developer who builds organized, reliable, and high-quality website solutions. I apply
          what I learn in real projects to my own work, where I explore new techniques and refine my skills.
      </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
          I’m a Drupal Developer with nearly two years of experience building responsive, multilingual websites and
          clean, maintainable solutions. I also created my Drupal 11 portfolio project, applying real-world skills and
          exploring new techniques to refine my craft.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Yerevan State University - website",
        timeframe: "August 2022 - May 2023",
        role: "Drupal Developer",
        achievements: [
          <>
              Develops features for YSU’s website using Drupal 9, managing content types,
              taxonomies, display modes, views, etc.
          </>,
          <>
              Delivers responsive, design-aligned pages across devices by implementing Twig
              templates and reusable components.
          </>,
          <>
              Builds and extends custom modules to meet project-specific requirements,
              ensuring maintainability and scalability.
          </>,
          <>
              Assists in configuring multilingual features within Drupal, supporting
              content accessibility in multiple languages.
          </>,
          <>
              Manages code with GitLab, uses Drush for local development and
              automation, and coordinates work with the team through merge requests.
          </>,
          <>
              Coordinates with team members to implement functionality, troubleshoot issues,
              and match designs.
          </>,
        ],
        images: [],
      },
      {
        company: "Vectus",
        timeframe: "October 2021 - July 2022",
        role: "Drupal Developer",
        achievements: [
            <>
                Utilizes Drupal core features to fix bugs on content types, Views, custom
                entities, and so on.
            </>,
            <>
                Develops responsive Twig templates aligned with design specifications to ensure
                consistent cross-device user experiences.
            </>,
            <>
                Builds and customizes modules to meet project-specific requirements,
                extending Drupal functionality for client solutions.
            </>,
            <>
                Manages source control via GitLab, executes site operations with
                Drush, and uses Lando for local environment setup and testing.
            </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "IT Talents",
        description: <>Studied Full Stack Development</>,
      },
      {
        name: "Dental Technician Practical Training",
        description: <></>,
      },
      {
            name: "Haybusak College",
            description: <>Dental Work</>,
      },
    ],
  },
    technical: {
        display: true,
        title: "Technical Skills",
        skills: [
            {
                title: "General Development",
                description: (
                    <>Other tools and technologies I use for web development projects.</>
                ),
                tags: [
                    { name: "Git" },
                    { name: "GitLab" },
                    { name: "Docker (Basic)" },
                    { name: "REST APIs" },
                    { name: "PHP" },
                ],
                images: [],
            },
            {
                title: "Drupal",
                description: (
                    <>Building organized, maintainable, multilingual websites using Drupal.</>
                ),
                tags: [
                    { name: "Views" },
                    { name: "Content Types" },
                    { name: "Taxonomy" },
                    { name: "Blocks" },
                    { name: "Menus" },
                    { name: "Fields" },
                    { name: "Image Optimization" },
                    { name: "Drush" },
                    { name: "Lando" },
                    { name: "Composer" },
                    { name: "Twig" },
                    { name: "Custom Modules" },       // new
                    { name: "Configuration Management" }, // new
                    { name: "Multilingual" },         // new
                ],
                images: [],
            },
            // {
            //     title: "Next.js",
            //     description: (
            //         <>Building next-gen apps with Next.js + Once UI + Supabase.</>
            //     ),
            //     tags: [
            //         { name: "JavaScript", icon: "javascript" },
            //         { name: "Next.js", icon: "nextjs" },
            //         { name: "Supabase", icon: "supabase" },
            //         { name: "React" },                // new
            //         { name: "Tailwind CSS" },         // new if used in your projects
            //     ],
            //     images: [],
            // },
        ],
    },
    // technical: {
  //   display: true, // set to false to hide this section
  //   title: "Technical skills",
  //   skills: [
  //     {
  //       title: "Drupal",
  //       description: (
  //         <>Able to prototype in Figma with Once UI with unnatural speed.</>
  //       ),
  //       tags: [
  //         {
  //           name: "PHP",
  //         },
  //         {
  //           name: "Views",
  //         },
  //         {
  //           name: "Content Types",
  //         },
  //         {
  //           name: "Taxonomy",
  //         },
  //         {
  //           name: "Blocks",
  //         },
  //         {
  //           name: "Menus",
  //         },
  //         {
  //           name: "Fields",
  //         },
  //         {
  //           name: "Drush",
  //         },
  //         {
  //           name: "Lando",
  //         },
  //         {
  //           name: "Composer",
  //         },
  //         {
  //           name: "Twig",
  //         },
  //       ],
  //       // optional: leave the array empty if you don't want to display images
  //       images: [],
  //     },
  //     {
  //       title: "Next.js",
  //       description: (
  //         <>Building next gen apps with Next.js + Once UI + Supabase.</>
  //       ),
  //       tags: [
  //         {
  //           name: "JavaScript",
  //           icon: "javascript",
  //         },
  //         {
  //           name: "Next.js",
  //           icon: "nextjs",
  //         },
  //         {
  //           name: "Supabase",
  //           icon: "supabase",
  //         },
  //       ],
  //       // optional: leave the array empty if you don't want to display images
  //       images: [],
  //     },
  //   ],
  // },
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // All projects will be listed on the /home and /work routes
};

export { person, social, home, about, work };
