export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto h-screen flex">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the logo"
        />
        <div className="flex flex-col gap-4 items-center justify-between">
          <h1 class="text-4xl font-bold">duyet.net</h1>
          <div className="inline-flex gap-4">
            <a className="hover:underline p-4" href="/blog">/blog →</a>
            <a className="hover:underline p-4" href="/cv">/cv →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
