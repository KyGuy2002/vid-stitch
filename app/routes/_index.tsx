import type { MetaFunction } from "@remix-run/cloudflare";
import "./index.scss";
import Header from "~/components/Header/Header";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!",
    },
  ];
};

export default function Index() {
  return (
    <div>
      

      <Header/>


    </div>
  );
}
