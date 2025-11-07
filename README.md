Cloudflare Pages — GitHub integration (minimal static site)

This repository is a minimal static site intended to test Cloudflare Pages' Git integration with GitHub.

Files:
- `public/index.html` — example page
- `public/style.css` — simple styles

To use the family photo on the homepage:

- Place your photo file named `family.jpg` in the `public/` directory. The homepage references `/family.jpg` as the hero and gallery image.

Example:

```bash
# copy your image into the project
cp ~/Downloads/family.jpg /path/to/hostiladmin-cf/public/family.jpg
```

Quick steps

1) Initialize a local Git repo and push to GitHub (replace <your-repo> with the real name):

```bash
cd /path/to/hostiladmin-cf
git init
git add .
git commit -m "Initial commit: Cloudflare Pages test site"
git branch -M main
# Create the remote repo on GitHub (you can use the website or `gh`):
# Using GitHub CLI (optional):
# gh repo create <your-username>/<your-repo> --public --source=. --remote=origin --push
# Or create the repo on github.com and then:
# git remote add origin git@github.com:<your-username>/<your-repo>.git
# git push -u origin main
```

2) In the Cloudflare dashboard, go to Pages -> Create a project
- Connect your GitHub account when prompted
- Select the repository you just pushed
- Branch: `main` (or whichever branch you pushed)
- Build command: leave blank (static site)
- Build output directory: `public`

Cloudflare Pages will create a preview and production deployment. You can use the Cloudflare-provided domain for the first test.

If you later choose a framework (Vite, Next.js, Hugo, etc.), update the repo with the appropriate build scripts and set the "Build command" and "Build output directory" accordingly in the Pages UI.

Notes
- If you add serverless functions later, you may choose Pages Functions or integrate Workers with Pages. For many static sites, no extra config is needed.
- To automate repo creation, install the GitHub CLI (`gh`) and use the commands shown above.

Troubleshooting
- If the site doesn't appear, check the Pages build logs in the Cloudflare dashboard.
- Ensure `public/index.html` is present and that the build output directory is set to `public`.
