import { get } from 'svelte/store'
import { fireEvent, render, screen } from '@testing-library/svelte'
import Sidebar from './Sidebar.svelte'
import { currentPath } from '../lib/navigation.js'

const current = (name) => screen.getByRole('link', { name })
let resetModuleCache = false

function setPath(path) {
  window.history.replaceState(null, '', path)
  currentPath.set(window.location.pathname)
}

describe('Sidebar', () => {
  beforeEach(() => {
    setPath('/')
  })

  afterEach(() => {
    vi.doUnmock('../lib/navigation.js')
    if (resetModuleCache) {
      vi.resetModules()
      resetModuleCache = false
    }
  })

  it('menampilkan menu utama dan menandai beranda aktif', () => {
    setPath('/')
    render(Sidebar, { open: true, onclose: vi.fn() })
    expect(current('Semua Link Tree')).toHaveAttribute('aria-current', 'page')
    expect(current('Pengguna')).not.toHaveAttribute('aria-current')
    expect(current('Profil')).not.toHaveAttribute('aria-current')
  })

  it('menu Semua Link Tree aktif pada halaman detail', () => {
    setPath('/link-trees/5')
    render(Sidebar, { open: true, onclose: vi.fn() })
    expect(current('Semua Link Tree')).toHaveAttribute('aria-current', 'page')
  })

  it('menandai menu pengguna dan profil', () => {
    setPath('/users')
    const { unmount } = render(Sidebar, { open: false, onclose: vi.fn() })
    expect(current('Pengguna')).toHaveAttribute('aria-current', 'page')
    unmount()
    setPath('/profile')
    render(Sidebar, { open: false, onclose: vi.fn() })
    expect(current('Profil')).toHaveAttribute('aria-current', 'page')
  })

  it('mengatur kelas tampilan berdasarkan prop open', () => {
    setPath('/')
    const { unmount } = render(Sidebar, { open: true, onclose: vi.fn() })
    expect(screen.getByLabelText('Menu utama')).toHaveClass('block')
    unmount()
    render(Sidebar, { onclose: vi.fn() })
    expect(screen.getByLabelText('Menu utama')).toHaveClass('hidden')
  })

  it('menetapkan kelas menu aktif dan tidak aktif sesuai path', () => {
    setPath('/profile')
    render(Sidebar, { open: true, onclose: vi.fn() })
    expect(current('Profil')).toHaveClass('bg-indigo-50', 'text-indigo-700')
    expect(current('Semua Link Tree')).toHaveClass('text-slate-600', 'hover:bg-slate-100')
  })

  it('tidak menandai menu apa pun aktif pada rute yang tidak terdaftar', () => {
    setPath('/auth/login')
    render(Sidebar)
    for (const label of ['Semua Link Tree', 'Pengguna', 'Profil']) {
      expect(current(label)).not.toHaveAttribute('aria-current')
      expect(current(label)).toHaveClass('text-slate-600', 'hover:bg-slate-100')
    }
    expect(screen.getByLabelText('Menu utama')).toHaveClass('hidden')
  })

  it('klik menu bernavigasi dan memanggil onclose', async () => {
    setPath('/')
    const onclose = vi.fn()
    render(Sidebar, { open: true, onclose })
    await fireEvent.click(current('Profil'))
    expect(get(currentPath)).toBe('/profile')
    expect(onclose).toHaveBeenCalledTimes(1)
  })

  it('klik menu tetap bernavigasi saat onclose tidak diberikan', async () => {
    setPath('/')
    render(Sidebar)
    await fireEvent.click(current('Pengguna'))
    expect(get(currentPath)).toBe('/users')
    expect(window.location.pathname).toBe('/users')
  })

  it('tetap merender menu saat action link tidak tersedia', async () => {
    vi.doMock('../lib/navigation.js', async (orig) => ({
      ...(await orig()),
      link: undefined
    }))
    resetModuleCache = true
    const SidebarWithoutLink = (await import('./Sidebar.svelte?without-link-action')).default

    render(SidebarWithoutLink, { open: true })

    const labels = ['Semua Link Tree', 'Pengguna', 'Profil']
    expect(screen.getAllByRole('link')).toHaveLength(3)
    for (const label of labels) {
      expect(current(label)).toBeInTheDocument()
    }
  })
})
