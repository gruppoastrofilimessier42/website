import Image from 'next/image'
import ToggleThemeButton from '../buttons/ThemeToggleButton'

export default function Header() {

  return (
    <>
      <div className="flex justify-between bg-stone-200 dark:bg-stone-800 px-2 md:px-20 items-center backdrop-blur-sm w-full py-4">
        <div>
          <a
            className="flex items-center"
            href="https://github.com/hossein13m/nextjs-tailwind-dark-theme"
            target="blank"
          >
            <h1 className="text-black sm:text-2xl ml-2 dark:text-white">GAM 42</h1>
          </a>
        </div>
        <ToggleThemeButton />
      </div>
    </>
  )
}
