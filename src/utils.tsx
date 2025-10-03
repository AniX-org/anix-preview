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
    // sourcery skip: use-braces
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
    //@ts-ignore
    const rvg_wasm_wbg = await import("@resvg/resvg-wasm/index_bg.wasm");
    await initWasm(rvg_wasm_wbg.default);
    initialized = true;
    console.log("Resvg wasm initialized");
  } catch (error) {
    console.error("Resvg wasm not initialized", error);
  }
}

export const generateProfileOpenGraphImage = async (user: any, blog: any) => {
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
            border: "#151515A0 2px solid",
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
          {user.is_verified && (
            <p
              style={{
                fontSize: 24,
                leading: 1,
                border: `#315531 2px solid`,
                borderRadius: 32,
                padding: "8px 16px",
                margin: 0,
              }}
            >
              Проверенный
            </p>
          )}
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

export function numberDeclension(
  number: number,
  one: string,
  two: string,
  five: string
) {
  if (number > 10 && [11, 12, 13, 14].includes(number % 100)) return five;
  let last_num = number % 10;
  if (last_num == 1) return one;
  if ([2, 3, 4].includes(last_num)) return two;
  if ([5, 6, 7, 8, 9, 0].includes(last_num)) return five;
}

export function minutesToTime(min: number) {
  const seconds = min * 60;
  const epoch = new Date(0);
  const date = new Date(seconds * 1000);

  const diffInMinutes =
    new Date(date.getTime() - epoch.getTime()).getTime() / 1000 / 60;

  let days = Math.floor(diffInMinutes / 1440);
  if (days < 0) days = 0;
  const daysToMinutes = days * 1440;

  let hours = Math.floor((diffInMinutes - daysToMinutes) / 60);
  if (hours < 0) hours = 0;
  const hoursToMinutes = hours * 60;

  let minutes = diffInMinutes - daysToMinutes - hoursToMinutes;
  if (minutes < 0) minutes = 0;

  const dayDisplay =
    days > 0 ? `${days} ${numberDeclension(days, "день", "дня", "дней")}` : "";
  const hourDisplay =
    hours > 0
      ? `${hours} ${numberDeclension(hours, "час", "часа", "часов")}`
      : "";
  const minuteDisplay =
    minutes > 0
      ? `${minutes} ${numberDeclension(minutes, "минута", "минуты", "минут")}`
      : "";

  if (days > 0 && hours > 0 && minutes > 0)
    return `${dayDisplay}, ${hourDisplay}, ${minuteDisplay}`;
  if (days > 0 && hours > 0) return `${dayDisplay}, ${hourDisplay}`;
  if (days > 0 && minutes > 0) return `${dayDisplay}, ${minuteDisplay}`;
  if (hours > 0 && minutes > 0) return `${hourDisplay}, ${minuteDisplay}`;
  if (days > 0) return dayDisplay;
  if (hours > 0) return hourDisplay;
  if (minutes > 0) return minuteDisplay;
}
