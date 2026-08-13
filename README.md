# Khalid's Digital Canvas

Khalid Usman Portfolio Website



Build a premium, highly phed personal portfolio website for Khalid Usman, a ProductI/UX Designer.



The website should feel like a carefully art-directed digital product, not a generic designer portfolio template.



1. Overall Creative Direction



Design language:



- Premium digital

- Minimal

- Editorial

- Sophisticated

- Highly visual

- Confident

- Contemporary

- Typography-led

- Lots of intentional whitespace

- Strong visual hierarchy

- Subtle, refined interactions



The website should feel expensive through typography, spacing, composition, imagery, motion and attention to detail, not through excessive visual effects.



Avoid the typical AI-generated portfolio aesthetic.



Explicitly avoid:



- Excessive gradients

- Neon colours

- Glassmorphism

- Excessive glass cards

- Floating 3D objects

- Excessive rounded cards

- Giant pill-shaped UI

- Excessive shadows

- Generic SaaS landing-page layouts

- Stock photography

- Fake testimonials

- Fake client logos

- Invented statistics

- Excessive animations

- Cursor particle effects

- Unnecessary decorative elements

- Generic "Hello, I'm a designer 🚀" messaging



The result should feel deliberately designed by a professional product designer.



---



2. Brand



Name:



Khalid Usman



Professional identity:



Product Designer



Primary focus:



- Product Design

- UI/UX Design

- Digital Products

- Interaction Design

- Design Systems



The name "Khalid Usman" should be used throughout the site rather than an abbreviated personal brand.



---



3. Colour System



The portfolio itself must use a strict black and white visual system.



Core colours



- White: "#FFFFFF"

- Black: "#000000"

- Off-white: "#F5F5F5"

- Secondary text: "#6B6B6B"

- Border: "#E5E5E5"



Do not introduce a permanent accent colour.



Important:



The portfolio chrome should remain monochrome.



Project imagery must retain its original colours.



This means the portfolio acts as a monochrome gallery while individual projects can introduce their own visual identities.



For example:



- NairaWise can retain its green interface

- Füd can retain its terracotta interface

- Other projects can retain their original brand colours



Do not recolour project screenshots to fit the website.



---



4. Typography



Use a premium modern typography system.



Prioritise:



- Strong display typography

- Excellent readability

- Large editorial headlines

- Tight but intentional hierarchy

- Generous line-height for body copy



Use a modern sans-serif as the primary typeface.



Optionally introduce a restrained editorial serif for specific emphasis, but do not overuse it.



Do not use typography merely for decoration.



Create a clear hierarchy for:



- Display

- H1

- H2

- H3

- Body

- Small text

- Metadata

- Navigation

- Labels



Typography should do most of the visual work.



---



5. Layout System



Use a responsive grid.



Desktop should feel spacious and editorial.



Use generous horizontal margins and large vertical spacing.



Use a consistent spacing system based primarily around multiples of 8px.



Avoid making every section look like a collection of cards.



Prefer:



- Full-width compositions

- Large project imagery

- Asymmetric layouts

- Strong alignment

- Editorial spacing

- Large typography



Use cards only where they genuinely improve usability.



---



6. Navigation



Create a minimal fixed/sticky navigation.



Desktop:



Left:



Khalid Usman



Right:



- Work

- About

- Contact

- Resume



The navigation should remain visually quiet.



On scroll, it may become slightly translucent or blurred, but keep the effect subtle.



Mobile should use a clean menu.



Do not create a large floating navigation pill.



---



7. Homepage Structure



The homepage should contain:



1. Navigation

2. Hero

3. Selected Work

4. Design Philosophy

5. About

6. Skills / Toolkit

7. Contact

8. Footer



The portfolio work should receive the largest amount of visual attention.



---



8. Hero Section



Create a large, typography-driven hero.



Primary headline:



I design digital products with clarity and character.



Supporting copy:



Product designer focused on creating thoughtful digital experiences, interfaces and products.



Include a small metadata line such as:



PRODUCT DESIGN / UI/UX / DIGITAL EXPERIENCES



Primary CTA:



View my work



Secondary CTA:



Let's talk ↗



Do not use a large hero illustration.



The hero should rely on:



- Typography

- Whitespace

- Scale

- Alignment

- Subtle motion



Make the opening viewport feel calm, premium and confident.



---



9. Selected Work



This is the central section of the portfolio.



Heading:



Selected Work



Projects should NOT be presented as a generic three-column card grid.



Instead, create large editorial project compositions.



Each project should contain:



- Project number

- Project title

- Short description

- Category

- Year

- Large cover image

- CTA

- Subtle hover interaction



Example:



01



NairaWise



Financial platform

Product Design · UI/UX · 2026



[Large project image]



View case study ↗



Then repeat for other projects.



Allow projects to alternate between different compositions while maintaining a consistent visual system.



---



10. CMS Architecture



The portfolio MUST be content-driven.



Do not hard-code individual projects into the page.



Use a headless CMS such as Sanity.



Create a reusable Project content model.



Each Project should support:



- Title

- Slug

- Short description

- Category

- Year

- Role

- Cover image

- Project thumbnail

- Hero image

- Gallery images

- Project overview

- Problem

- Research

- Insights

- Design process

- Design decisions

- Final solution

- Results / outcomes

- Reflection

- Tools

- External links

- Featured project toggle

- Project ordering



The CMS should support rich text content and image uploads.



Images should support:



- Alt text

- Captions

- Different aspect ratios

- Responsive optimisation



---



11. Adding Projects



The website must make it possible to add new projects through the CMS without modifying the frontend code.



When a new project is created in the CMS:



- It should automatically appear in Selected Work if marked as featured.

- It should automatically receive its own case-study URL.

- Its cover image should automatically populate the project card.

- Its metadata should automatically populate.

- Its gallery should automatically populate the case study.

- Its content should inherit the existing typography and layout system.



The frontend should be built from reusable project components.



Do not create separate hard-coded page layouts for individual projects unless the CMS content model explicitly requires a custom section.



---



12. Case Study Pages



Each project should have its own dynamic case-study page.



URL structure:



"/work/project-slug"



The case study should feel editorial and immersive.



Suggested structure:



Project Header



Project title



Category



Year



Role



Short description



Large hero image



Overview



A concise project introduction.



Problem



Explain the problem being addressed.



Research / Insights



Support rich text and image content.



Design Process



Show relevant process artefacts.



Design Decisions



Explain important UX/UI decisions.



Final Product



Give the interface substantial visual space.



Support:



- Full-width screenshots

- Device mockups

- Image galleries

- Image grids

- Side-by-side comparisons

- Annotated images

- Captions



Reflection



Short conclusion about what was learned.



Next Project



At the bottom, automatically show the next project from the CMS.



---



13. Flexible Case Study Content



The case-study system must not assume every project has the exact same number of images.



A project may have:



- 3 images

- 10 images

- 25 images

- Mostly text

- Mostly visuals

- Multiple image galleries



Build reusable content blocks so the CMS can support:



- Rich text

- Full-width image

- Image gallery

- Two-column images

- Three-column images

- Large screenshot

- Text + image

- Quote

- Video

- Section heading

- Metrics

- Process timeline



The layout should remain visually consistent regardless of how much content a project contains.



---



14. Design Philosophy Section



Create a section titled:



How I think



Use three principles:



Clarity



Interfaces should make complicated things easier to understand.



Intent



Every element should have a reason to exist.



Character



Useful products can still have personality.



Keep this section visually restrained.



---



15. About Section



Create a concise editorial About section.



Headline:



I'm Khalid Usman, a product designer interested in making digital products clearer, more useful and more human.



Then provide space for a more personal paragraph that can be edited later.



Include a compact skills section.



Possible categories:



Design



- Product Design

- UI Design

- UX Design

- Interaction Design

- Design Systems

- Prototyping



Tools



- Figma

- FigJam

- Framer

- Other relevant tools



Do not turn this into a giant skills cloud.



---



16. Contact Section



Make the contact section visually significant.



Headline:



Let's make something worth using.



Primary CTA:



Get in touch ↗



Display the email address prominently.



Include social links such as:



- LinkedIn

- Behance

- Other relevant portfolio/social platforms



Keep it simple.



---



17. Footer



Minimal footer.



Include:



Khalid Usman



Product Designer



Links:



- Work

- About

- Contact

- Resume

- LinkedIn

- Behance



Include a small copyright line.



---



18. Motion Design



Use subtle, premium motion.



Interactions should include:



- Smooth hover transitions

- Slight project image scaling

- Subtle title movement

- Arrow movement on CTA hover

- Smooth page transitions

- Scroll-based reveal animations

- Gentle image entrance animations



Avoid excessive animation.



Animation duration should generally feel fast and intentional.



Use easing curves that feel natural rather than mechanical.



Respect "prefers-reduced-motion".



---



19. Responsive Design



The site must be designed responsively rather than simply shrinking the desktop layout.



Prioritise:



Desktop



1440px and above



Tablet



768px to 1199px



Mobile



393px and similar widths



The mobile version should remain visually premium.



Do not simply stack everything vertically.



Reconsider:



- Typography scale

- Image crops

- Navigation

- Spacing

- Project compositions

- Gallery layouts



for mobile.



---



20. Accessibility



Follow good accessibility practices.



Include:



- Semantic HTML

- Proper heading hierarchy

- Alt text

- Keyboard navigation

- Visible focus states

- Accessible contrast

- Reduced-motion support

- Proper button/link semantics



Do not sacrifice accessibility for visual effects.



---



21. Performance



Optimise the portfolio for fast loading.



Use:



- Responsive images

- Lazy loading

- Modern image formats

- CMS image optimisation

- Proper image sizing

- Minimal unnecessary JavaScript



Do not load huge portfolio screenshots at their original raw dimensions when they are displayed much smaller.



---



22. Technical Architecture



Recommended stack:



- Next.js

- TypeScript

- Tailwind CSS

- Sanity CMS

- Vercel

- Modern image optimisation



Use reusable components.



Suggested component structure:



- Navigation

- Hero

- ProjectList

- ProjectCard

- ProjectHeader

- CaseStudySection

- ImageGallery

- RichText

- About

- Skills

- Contact

- Footer



Keep content separate from presentation.



The CMS should control content.



The frontend should control the design system.



---



23. CMS Admin Experience



The CMS should be easy to use.



I should be able to log into the CMS and:



1. Create a project

2. Upload its cover image

3. Upload project screenshots

4. Enter its title

5. Add description

6. Add category

7. Add year

8. Write the case study

9. Arrange images

10. Mark it as featured

11. Publish



I should NOT need to edit frontend code to add portfolio work.



---



24. Important Design Principle



Do not overdesign the website.



The portfolio is a frame for Khalid Usman's work.



The website should establish the visual identity, while the actual projects provide the colour, complexity and visual storytelling.



The result should feel:



Minimal.

Premium.

Confident.

Human.

Intentional.



It should look like a designer designed the website, not like an AI generated a portfolio template.



Build the foundation first, then implement the homepage, then the CMS integration, then the dynamic case-study system, then polish the interactions and responsive behaviour.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://khalid-usman.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/07844c0d-6b75-4912-816a-202cf3805abc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
