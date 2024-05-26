

export default function Header() {
  return (
    <header className="bg-sky-200 flex items-center px-5 py-2 rounded-xl">

      <a className="text-blue-800 font-bold text-3xl" href="/" >Vid<span className="text-black">Stitch</span></a>

      <a
        href="https://github.com/KyGuy2002/vid-stitch"
        target="_blank"
        className="ml-auto text-xl font-bold uppercase"
      >
        <img src="/fontawesome/github.svg" className="w-6"/>
      </a>


    </header>
  );
}
