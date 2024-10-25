import { Head } from "$fresh/runtime.ts";
import type { PageProps } from "$fresh/server.ts";

interface Message {
  title?: string;
  message?: string;
}

export default function Error404(props: PageProps<Message>) {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div class="flex min-h-screen px-4 py-8 mx-auto bg-[#86efac]">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <img
            class="my-6"
            src="/logo.svg"
            width="128"
            height="128"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
          <h1 class="text-4xl font-bold">
            {props.data.title || "404 - Page not found"}
          </h1>
          <p class="my-4">
            {props.data.message ||
              "The page you were looking for doesn't exist."}
          </p>
          <a href="/" class="underline">Go back home</a>
        </div>
      </div>
    </>
  );
}
