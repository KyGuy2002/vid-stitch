import type { MetaFunction } from "@remix-run/cloudflare";
import { useEffect } from "react";
import { ClientOnly } from "remix-utils/client-only";
import FileUpload from "~/components/FileUpload.client";
import Header from "~/components/Header/Header";

export const meta: MetaFunction = () => {
  return [
    { title: "VidStitch - Video Clip Stitcher" },
    {
      name: "description",
      content: "Quickly and safely stitch multiple video clips into one!",
    },
  ];
};

export default function Index() {
  return (
    <>
      <h1
        className="text-center font-bold text-4xl text-gray-800 mb-3"
      >
        <span className="text-blue-800">Free</span> & <span className="text-blue-800">Local</span> Video Stitcher
      </h1>

      <p
        className="text-center mb-5"
      >
        Everything is done on your device, making VidStitch completely free!  No uploading or cloud processing is needed.
      </p>

      {/* NOTE: For some reason this needs the .client.tsx AND the ClientOnly or else it explodes... */}
      <ClientOnly fallback={<div className="bg-sky-200 p-8 rounded-3xl" style={{ minHeight: "270px" }}></div>}>
        {() => <FileUpload/>}
      </ClientOnly>


      <div className="flex mt-5 gap-5 flex-wrap basis-0">

        <div className="bg-sky-200 px-4 py-3 rounded-3xl flex-grow basis-0 min-w-60">
          <p className="font-bold flex align-center gap-1.5"><img src="/fontawesome/server-solid.svg" className="w-4 inline"/> 100% Local</p>
          <p className="text-sm">Nothing leaves this device.</p>
        </div>

        <div className="bg-sky-200 px-4 py-3 rounded-3xl flex-grow basis-0 min-w-60">
          <p className="font-bold flex align-center gap-1.5"><img src="/fontawesome/cloud-arrow-up-solid.svg" className="w-4 inline"/> No Cloud</p>
          <p className="text-sm">Cloud servers are not used.</p>
        </div>

        <div className="bg-sky-200 px-4 py-3 rounded-3xl flex-grow basis-0 min-w-60">
          <p className="font-bold flex align-center gap-1.5"><img src="/fontawesome/dollar-sign-solid.svg" className="w-2.5 inline"/> Free</p>
          <p className="text-sm">Service is 100% free.</p>
        </div>

        <div className="bg-sky-200 px-4 py-3 rounded-3xl flex-grow basis-0 min-w-60">
          <p className="font-bold flex align-center gap-1.5"><img src="/fontawesome/bolt-solid.svg" className="w-2.5 inline"/> Lightning Fast</p>
          <p className="text-sm">No uploads or downloads.</p>
        </div>

      </div>
    </>
  );
}
