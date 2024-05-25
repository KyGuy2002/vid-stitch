

export default function Header() {
  return (
    <header className="bg-sky-200 flex items-center px-5 py-2 rounded-xl">

      <p className="text-blue-800 font-bold text-3xl">Vid<span className="text-black">Stitch</span></p>

      <a
        href="https://github.com/KyGuy2002/vid-stitch"
        className="ml-auto text-xl font-bold uppercase"
      >
        <img src="/fontawesome/github.svg" className="w-6"/>
      </a>


    </header>
  );
}
