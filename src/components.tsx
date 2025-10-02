import conf from "./config.json";

interface AppProps {
  pageTitle: string;
  children: any;
}

export const App = ({ children, pageTitle }: AppProps) => {
  return (
    <html>
      <head>
        <title>{pageTitle}</title>
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
    <a href={path} class="flex gap-4 items-center text-[20px] px-[32px] py-[16px] rounded-[32px] border bg-[var(--bg-color)] text-[var(--fg-color)] border-[var(--fg-color)]/10 hover:border-[var(--fg-color)] transition-[border]" style={`--bg-color: ${bg}; --fg-color: ${fg};`}>
      {image ? <img src={image} alt="" class="w-[32px] h-[32px] object-contain" /> : ""}
      {text}
    </a>
  );
};

interface ButtonGroupProps {
  path: string;
}

export const ButtonGroup = ({ path }: ButtonGroupProps) => {
  return (
    <div class="flex flex-col gap-4">
      {conf.targets.length > 0 ? (
        conf.targets.map((target) => (
          <Button
            text={`Открыть в ${target.name}`}
            path={path + target.url}
            image={target.icon}
            bg={target.buttonBg}
            fg={target.buttonFg}
          />
        ))
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
