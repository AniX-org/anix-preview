import satori from "satori";
import { Resvg, initWasm } from "@resvg/resvg-wasm";
import { getRuntimeKey } from "hono/adapter";

export async function fetchFont(url: URL | string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch font: ${response.statusText}`);
  }
  return response.arrayBuffer();
}

let initialized = false;

export async function initResvgWasm() {
  try {
    const runtime = getRuntimeKey();
    if (initialized) return;

    if (runtime == "node") {
      console.log("Init Resvg WASM for Node");
      const wasmResponse = await fetch(
        "https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm"
      );
      const wasmArrayBuffer = await wasmResponse.arrayBuffer();
      await initWasm(wasmArrayBuffer);
      initialized = true;
      console.log("Resvg wasm initialized");
      return;
    }

    console.log("Init Resvg WASM for Edge");
    const rvg_wasm_wbg = await import("@resvg/resvg-wasm/index_bg.wasm");
    await initWasm(rvg_wasm_wbg.default);
    initialized = true;
    console.log("Resvg wasm initialized");
  } catch (error) {
    console.error("Resvg wasm not initialized", error);
  }
}

export const createOpenGraphImage = async (user: any, blog: any) => {
  await initResvgWasm();
  let svg: string | undefined;
  svg = await satori(
    <div
      style={{
        width: 512,
        height: 512,
        FontFace: "Geist",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0E131F",
        borderRadius: 32,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 512,
          height: 512,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#151515",
          color: "#FAFAFA",
          borderRadius: 32,
          overflow: "hidden",
          padding: 32,
          position: "relative",
        }}
      >
        {blog ? (
          <img
            src={blog.cover}
            style={{
              position: "absolute",
              width: 512,
              height: 270,
              top: 0,
              left: 0,
              right: 0,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              objectFit: "cover",
              filter: "blur(8px)",
            }}
          ></img>
        ) : (
          <img
            src={user.avatar}
            style={{
              position: "absolute",
              width: 512,
              height: 270,
              top: 0,
              left: 0,
              right: 0,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              objectFit: "cover",
              filter: "blur(8px)",
            }}
          ></img>
        )}
        <div
          style={{
            position: "absolute",
            width: 512,
            height: 270,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            background: "linear-gradient(to top, #151515, #15151599)",
          }}
        ></div>
        <img
          src={user.avatar}
          style={{
            width: 200,
            height: 200,
            objectFit: "cover",
            borderRadius: 9999,
            border: "#151515 2px solid",
            borderOpacity: 0.2,
          }}
        ></img>
        <h1
          style={{
            fontSize: 64,
            overflowWrap: "anywhere",
          }}
        >
          {user.login}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {user.roles.map((role: any) => {
            return (
              <p
                style={{
                  fontSize: 24,
                  leading: 1,
                  border: `#${role.color} 2px solid`,
                  borderRadius: 32,
                  padding: "8px 16px",
                  margin: 0,
                }}
              >
                {role.name}
              </p>
            );
          })}
        </div>
      </div>
    </div>,
    {
      width: 512,
      height: 512,
      fonts: [
        {
          name: "Geist",
          data: await fetchFont(
            "https://github.com/vercel/geist-font/raw/refs/heads/main/fonts/Geist/ttf/Geist-Regular.ttf"
          ),
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  let png;
  png = new Resvg(svg).render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
