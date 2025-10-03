import conf from "./config.json";

interface AppProps {
  pageTitle?: string;
  pageIcon?: string;
  children: any;
  openGraph?: {
    url: string;
    description: string;
    image: string;
    imageWidth: number;
    imageHeight: number;
  };
}

export const App = ({ children, pageTitle, pageIcon, openGraph }: AppProps) => {
  return (
    <html>
      <head>
        <meta charset="UTF-8"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <title>{pageTitle || "Anixart-Preview"}</title>
        <meta
          property="og:title"
          content={pageTitle || "Anixart-Preview"}
        ></meta>
        {openGraph ? (
          <>
            <meta property="og:url" content={openGraph.url}></meta>
            <meta
              property="og:description"
              content={openGraph.description}
            ></meta>
            <meta property="og:image" content={openGraph.image}></meta>
            <meta property="og:image:type" content="image/webp"></meta>
            <meta
              property="og:image:width"
              content={`${openGraph.imageWidth}`}
            ></meta>
            <meta
              property="og:image:height"
              content={`${openGraph.imageHeight}`}
            ></meta>
            <meta property="og:image:alt" content=""></meta>
          </>
        ) : (
          ""
        )}
        {pageIcon ? <link rel="icon" href={pageIcon} /> : ""}
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <link href="https://unpkg.com/pattern.css" rel="stylesheet"></link>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap"
          rel="stylesheet"
        ></link>
        <style>
          {`
                :root {
                    --background-color: #0E131F;
                    --card-color: #151515;
                    --text-color: #FAFAFA;
                }

                .geist-400 {
                    font-family: "Geist", sans-serif;
                    font-optical-sizing: auto;
                    font-weight: 400;
                    font-style: normal;
                }
            `}
        </style>
        <script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"></script>
      </head>
      <body
        class={
          "bg-[var(--background-color)] text-[var(--text-color)] geist-400 p-8 max-w-sm mx-auto"
        }
      >
        <div class="fixed inset-0 pattern-dots-xl text-[var(--text-color)]/5 -z-20"></div>
        {children}
      </body>
    </html>
  );
};

interface ButtonProps {
  text: string;
  path: string;
  bg: string;
  fg: string;
  image?: string;
}

export const Button = ({ text, image, path, bg, fg }: ButtonProps) => {
  return (
    <a
      href={path}
      class="flex gap-4 items-center text-[20px] px-[32px] py-[16px] rounded-[32px] border bg-[var(--bg-color)] text-[var(--fg-color)] border-[var(--fg-color)]/10 hover:border-[var(--fg-color)] transition-[border]"
      style={`--bg-color: ${bg}; --fg-color: ${fg};`}
    >
      {image ? (
        <img src={image} alt="" class="w-[32px] h-[32px] object-contain" />
      ) : (
        ""
      )}
      {text}
    </a>
  );
};

interface ButtonGroupProps {
  type?: "profile";
  id?: string;
}

export const ButtonGroup = ({ type, id }: ButtonGroupProps) => {
  return (
    <div class="flex flex-col gap-4">
      {conf.targets.length > 0 ? (
        conf.targets.map((target) => {
          let btnUrl = null;

          if (!type || !id) {
            btnUrl = "";
          } else {
            if (target.url.startsWith("http")) {
              btnUrl = `${type}/${id}`;
            } else {
              btnUrl = `${type}?id=${id}`;
            }
          }

          return (
            <Button
              text={`Открыть в ${target.name}`}
              path={target.url + btnUrl}
              image={target.icon}
              bg={target.buttonBg}
              fg={target.buttonFg}
            />
          );
        })
      ) : (
        <>
          <p>Нет валидных ссылок, добавьте их в конфиг</p>
          <pre>
            {JSON.stringify(
              {
                targets: [
                  {
                    name: "Имя таргета",
                    url: "https://example.com/",
                    icon: "ссылка на иконку",
                  },
                ],
              },
              null,
              2
            )}
          </pre>
        </>
      )}
    </div>
  );
};

export const UserCard = ({ user, blog }: { user: any; blog: any }) => {
  return (
    <div class="flex flex-col gap-4 p-8 bg-[var(--card-color)] border border-[var(--text-color)]/10 rounded-[32px] relative overflow-hidden">
      {blog ? (
        <>
          <img
            src={blog.cover}
            class="w-full object-cover rounded-t-lg aspect-video absolute inset-0"
          />
          <div class="w-full bg-gradient-to-t from-[var(--card-color)] to-[var(--card-color)]/0 rounded-t-lg aspect-video absolute inset-0 backdrop-blur-lg"></div>
        </>
      ) : (
        <>
          <img
            src={user.avatar}
            class="w-full object-cover rounded-t-lg aspect-video absolute -top-4 left-0 right-0"
          />
          <div class="w-full bg-gradient-to-t from-[var(--card-color)] to-[var(--card-color)]/0 rounded-t-lg aspect-video absolute inset-0 backdrop-blur-lg"></div>
        </>
      )}
      <img
        src={user.avatar}
        alt=""
        class="w-[96px] h-[96px] rounded-full z-10 border-2 border-[var(--card-color)]/10 object-cover"
      />
      <div class="z-10">
        <div class="text-[32px] wrap-anywhere leading-none my-2 flex items-center gap-1">
          <span>{user.login}</span>
          {user.is_verified && <span><img src="/static/images/ic-verified.svg" style={{ width: 32, height: 32, marginLeft: 8 }}></img></span>}
        </div>
        <p class="text-[16px] whitespace-pre-wrap">{user.status}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        {user.roles.map((role: any) => (
          <div
            class="border border-[var(--role-color)] rounded-[16px] px-4 py-2 text-[14px] flex gap-2 items-center"
            style={`--role-color: ${role.color}`}
            id="role"
          >
            <div class="w-[14px] h-[14px] bg-[var(--role-color)] rounded-full"></div>
            <p>{role.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
