# Yemisi's portfolio

A small static site. No build step, no installs. Keep all the files together in one folder.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home: a glass hub over a picture, with your portrait on the left |
| `about.html` | About: summary, picture, interests, education, skills, tools, resume buttons |
| `works.html` | Works: category cards and a search bar |
| `works-data.html`, `works-automation.html`, `works-research.html` | One page per work category |
| `publications.html` | Publications: stat tabs, academic / articles and blogs toggle, search |
| `experience.html` | Experience: All, Work, Education, Community and volunteering, Leadership, search |
| `certifications.html` | Certifications and achievements: All, Courses, Degree, Membership, Awards, Service, search |
| `activity.html` | Activity: All, LinkedIn, Announcements, Twitter, Instagram, search |
| `contact.html` | Contact |
| `styles.css`, `script.js` | Styling (light and dark) and behaviour |

## Replace the two placeholder pictures

- **Your portrait:** save a portrait photo (taller than wide) as `photo.jpg`. It appears on Home and About.
- **Home background:** save a wide picture, at least 1600 pixels across, as `background.jpg`. The glass takes its colours from it. A calm picture works better than a busy one.

- **Browser tab picture:** save a small square picture (256 x 256 pixels works well) as `favicon.png`. A cropped face works best.

## Preview it

Double-click `index.html`.


**GitHub Pages:** create a repository called `yourusername.github.io`, upload all the files, then choose the main branch in Settings > Pages.

## Editing

- **Words:** open any `.html` file in a text editor and change the text.
- **Colours:** at the top of `styles.css`, change `--accent`. There is one set for light and one for dark.
- **Add a certification, award or membership:** in `certifications.html`, copy one `<li class="cert ...">` block. Set `data-type` to `course`, `degree`, `membership`, `award` or `service`, and change the badge text to match. To make it open a certificate, keep the `<a class="text-link cert-link" href="...">` line and paste your link in; delete that line if there is no link.
- **Add an experience entry:** in `experience.html`, copy one `<li class="xp-card ...">` block. `data-type` can be `work`, `education`, `community` or `leadership`. The bullets inside `<div class="xp-detail">` are what show when a card is opened.
- **Add an Activity post:** in `activity.html`, copy one `<li class="post ...">` block. `data-type` can be `announcement`, `linkedin`, `twitter` or `instagram`. Update the badge text too.
- **Add an article or blog post:** in `publications.html`, copy a paper block and set `data-type="other"`. Then delete the "No articles or blog posts yet" box.
- **Add a project:** copy a `<article class="card ...">` block into the category pages where it belongs, and add its name to the matching card on `works.html`.

The counts on the filter buttons are numbers typed into the HTML, so update them if you add or remove items.

