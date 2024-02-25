import MyThemeContext from '@/stores/global/themeContext';
import { useContext } from 'react'

export default function ToggleThemeButton() {
  const themeCtx: { isDarkMode?: boolean; toggleThemeHandler: () => void } = useContext(MyThemeContext)

  function toggleThemeHandler(): void {
    themeCtx.toggleThemeHandler()
  }
  return (
    <>
      <button
        type="button"
        className="py-1 sm:py-2.5 px-2 sm:px-5 mr-2 bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black rounded"
        onClick={toggleThemeHandler}
      >
        Toggle Theme
      </button>
    </>
  )
}
