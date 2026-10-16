<script>
  import { currentPath, navigate } from '../lib/navigation.js'

  let { open = false, onclose } = $props()

  function isActive(href, path) {
    if (href === '/') {
      if (path === '/') return true
      return path.startsWith('/link-trees')
    }
    return path === href
  }

  function handleLinkClick(event, href) {
    event.preventDefault()
    navigate(href)
    if (onclose) {
      onclose(event)
    }
  }
</script>

<aside
  aria-label="Menu utama"
  class="{open ? 'block' : 'hidden'} w-full shrink-0 border-b border-slate-200 bg-white p-4 md:block md:min-h-[calc(100vh-4rem)] md:w-60 md:border-r md:border-b-0"
>
  <nav class="flex flex-col gap-1">
    <a
      href="/"
      onclick={(event) => handleLinkClick(event, '/')}
      aria-current={isActive('/', $currentPath) ? 'page' : undefined}
      class="rounded-lg px-3 py-2 text-sm font-medium {isActive('/', $currentPath)
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-600 hover:bg-slate-100'}"
    >
      Semua Link Tree
    </a>
    <a
      href="/users"
      onclick={(event) => handleLinkClick(event, '/users')}
      aria-current={isActive('/users', $currentPath) ? 'page' : undefined}
      class="rounded-lg px-3 py-2 text-sm font-medium {isActive('/users', $currentPath)
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-600 hover:bg-slate-100'}"
    >
      Pengguna
    </a>
    <a
      href="/profile"
      onclick={(event) => handleLinkClick(event, '/profile')}
      aria-current={isActive('/profile', $currentPath) ? 'page' : undefined}
      class="rounded-lg px-3 py-2 text-sm font-medium {isActive('/profile', $currentPath)
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-600 hover:bg-slate-100'}"
    >
      Profil
    </a>
  </nav>
</aside>
