import { Hono } from 'hono'
import skills from '../../skills_index.json'

const app = new Hono()

app.get('/api/skills', (c) => {
  return c.json(skills)
})

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Find Skills</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 p-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-6 text-gray-800">Skill Finder</h1>
        <input type="text" id="search" placeholder="Search skills by name, description, or category..." class="w-full p-4 rounded shadow mb-6 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <div id="results" class="space-y-4"></div>
      </div>

      <script>
        let allSkills = [];

        async function loadSkills() {
          const res = await fetch('/api/skills');
          allSkills = await res.json();
          renderSkills(allSkills);
        }

        function renderSkills(skills) {
          const container = document.getElementById('results');
          container.innerHTML = '';

          skills.forEach(skill => {
            const div = document.createElement('div');
            div.className = 'bg-white p-6 rounded shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4';
            div.innerHTML = \`
              <div class="flex-1">
                <h2 class="text-xl font-semibold text-gray-800">\${skill.name}</h2>
                <div class="text-sm text-gray-500 mb-2">
                  <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">\${skill.category}</span>
                </div>
                <p class="text-gray-600">\${skill.description || 'No description available'}</p>
              </div>
              <div class="flex-shrink-0 flex flex-col items-end">
                <code class="bg-gray-100 text-gray-800 px-3 py-1 rounded border text-sm mb-2">\${skill.path}</code>
                <button onclick="copyToClipboard('\${skill.path}')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors">
                  Copy Path
                </button>
              </div>
            \`;
            container.appendChild(div);
          });
        }

        document.getElementById('search').addEventListener('input', (e) => {
          const term = e.target.value.toLowerCase();
          const filtered = allSkills.filter(s =>
            s.name.toLowerCase().includes(term) ||
            (s.description && s.description.toLowerCase().includes(term)) ||
            (s.category && s.category.toLowerCase().includes(term))
          );
          renderSkills(filtered);
        });

        window.copyToClipboard = function(text) {
          navigator.clipboard.writeText(text).then(() => {
            // Optional: show a toast or feedback
            alert('Copied to clipboard: ' + text);
          }).catch(err => {
            console.error('Failed to copy: ', err);
          });
        }

        loadSkills();
      </script>
    </body>
    </html>
  `)
})

export default app
