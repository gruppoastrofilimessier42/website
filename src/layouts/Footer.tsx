import Image from 'next/image'

export default function Footer() {
  return (
    <>
      <div className="flex justify-center bg-stone-200 dark:bg-stone-800 px-2 md:px-20 items-center backdrop-blur-sm w-full py-4">
        <a className="flex items-center" href="https://hmousavi.dev" target="blank">
          <h1 className="text-black sm:text-2xl ml-2 dark:text-white"> Test Footer</h1>
        </a>
      </div>
    </>
  )
}
