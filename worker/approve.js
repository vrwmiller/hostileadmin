// Cloudflare Worker stub: approve user endpoint
// Deploy this file as a Cloudflare Worker (or implement as a Pages Function).
// Required secrets (DO NOT COMMIT):
// - SUPABASE_URL (https://<project-ref>.supabase.co)
// - SUPABASE_SERVICE_ROLE (the service_role key)
// - ADMIN_SECRET (shared secret used to authenticate admin requests)

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request){
  if(request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })

  const ADMIN_SECRET = SUPABASE_ADMIN_SECRET || (typeof GLOBAL_THIS !== 'undefined' && GLOBAL_THIS.ADMIN_SECRET) // placeholder for deploy-time env
  const SUPABASE_URL = SUPABASE_URL || (typeof GLOBAL_THIS !== 'undefined' && GLOBAL_THIS.SUPABASE_URL)
  const SUPABASE_SERVICE_ROLE = SUPABASE_SERVICE_ROLE || (typeof GLOBAL_THIS !== 'undefined' && GLOBAL_THIS.SUPABASE_SERVICE_ROLE)

  // On Cloudflare, bind secrets via environment variables (wrangler or Pages secrets)
  const headerSecret = request.headers.get('X-ADMIN-SECRET')
  if(!headerSecret || headerSecret !== ADMIN_SECRET) return new Response('Unauthorized', { status: 401 })

  let body
  try{ body = await request.json() }catch(e){ return new Response('Bad Request: invalid json', { status: 400 }) }
  const id = body && body.id
  if(!id) return new Response('Bad Request: missing id', { status: 400 })

  // Update the profile via PostgREST (Supabase REST) using service_role key
  const patchUrl = `${SUPABASE_URL.replace(/\/+$/,'')}/rest/v1/profiles?id=eq.${encodeURIComponent(id)}`
  const payload = { approved: true, approved_at: new Date().toISOString() }

  const res = await fetch(patchUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_ROLE,
      'Authorization': 'Bearer ' + SUPABASE_SERVICE_ROLE,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(payload)
  })

  const text = await res.text()
  if(!res.ok) return new Response('Supabase error: '+text, { status: 500 })
  return new Response(text, { status: 200, headers: { 'Content-Type':'application/json' } })
}

// Notes for deployment:
// - In Wrangler (Cloudflare): set secrets with `wrangler secret put ADMIN_SECRET` and use environment variables for SUPABASE_URL and SUPABASE_SERVICE_ROLE.
// - In Pages Functions: configure Environment variables & secrets in the Pages project settings.
