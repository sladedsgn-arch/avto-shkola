import { useOutletContext } from 'react-router-dom'

interface LayoutCtx {
  goToFill: (path: string, e?: React.MouseEvent) => void
  openMenu: () => void
}

export function useLayoutCtx() {
  return useOutletContext<LayoutCtx>()
}
