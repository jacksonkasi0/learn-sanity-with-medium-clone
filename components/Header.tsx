import Link from 'next/link'
import { FC } from 'react'

const Header: FC = () => {
  return (
    <header className="mx-auto flex max-w-7xl justify-between p-5">
      <div className="item-center flex space-x-5">
        <Link href="/">
          <img
            src="https://miro.medium.com/max/8978/1*s986xIGqhfsN8U--09_AdA.png"
            className="w-44  cursor-pointer object-contain"
          />
        </Link>
        <div className="item-center hidden space-x-5 md:inline-flex">
          <h3>About</h3>
          <h3>Conatct</h3>
          <h3 className="item-center rounded-full bg-green-600 px-4 py-2 text-white">
            Follow
          </h3>
        </div>
      </div>
      <div className="item-center flex space-x-5 text-green-600 ">
        <h3>Sign In</h3>
        <h3 className="rounded-full border border-green-600 px-4 py-2">
          Get Started
        </h3>
      </div>
    </header>
  )
}

export default Header
