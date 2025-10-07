import conf from "./config.json";
import { minutesToTime, numberDeclension, unixToDate } from "./utils";

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
        <div
          id="auto-redirect-confirm"
          class="hidden translate-y-[var(--translate-y)] transition-[translate] duration-200 ease-in-out fixed bottom-8 left-0 right-0 mx-auto bg-[var(--card-color)] text-[var(--text-color)] px-4 py-2 max-w-sm border border-[var(--text-color)]/10 rounded-[16px]"
          style={{ "--translate-y": "200%" }}
        >
          <div class="flex gap-4 items-center justify-between">
            <img
              src="/static/icons/mingcute_question-line.svg"
              class="w-[24px] h-[24px] object-contain"
            />
            <p>Включить автопереход?</p>
            <div class="flex gap-2 items-center">
              <button
                class={"px-4 py-2 cursor-pointer"}
                id="auto-redirect-confirm-no"
              >
                Нет
              </button>
              <button
                id="auto-redirect-confirm-yes"
                class={
                  "bg-[var(--text-color)] text-[var(--card-color)] px-4 py-2 rounded-[16px] cursor-pointer"
                }
              >
                Да
              </button>
            </div>
          </div>
        </div>

        <div
          class="hidden inset-0 z-50 fixed bg-black/50"
          id="auto-redirect-service-select"
        >
          <div
            class={
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-8 mx-auto bg-[var(--card-color)] text-[var(--text-color)] max-w-sm border border-[var(--text-color)]/10 rounded-[16px]"
            }
          >
            <div class={"flex flex-col gap-4"}>
              <p
                class={
                  "font-bold text-[22px] pb-2 border-b border-[var(--text-color)]/25"
                }
              >
                Сервис для автоперехода
              </p>
              {conf.targets.map((target, index) => {
                return (
                  <button
                    class={
                      "cursor-pointer flex gap-2 items-center text-[20px] py-2 px-4 border border-[var(--text-color)]/25 hover:border-[var(--text-color)] transition-[border] rounded-[16px]"
                    }
                    data-autoredirect-service-item={index}
                  >
                    {target.icon ? (
                      <img
                        src={target.icon}
                        alt=""
                        class="w-[24px] h-[24px] object-contain"
                      />
                    ) : (
                      ""
                    )}
                    {target.name}
                  </button>
                );
              })}
              <div class={"flex gap-2 items-center justify-end"}>
                <button
                  id="auto-redirect-service-select-cancel"
                  class={
                    "bg-[var(--text-color)] text-[var(--card-color)] px-4 py-2 rounded-[16px] cursor-pointer"
                  }
                >
                  Отменить
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          id="auto-redirect-timeout"
          class="hidden translate-y-[var(--translate-y)] transition-[translate] duration-200 ease-in-out fixed bottom-8 left-0 right-0 mx-auto bg-[var(--card-color)] text-[var(--text-color)] px-4 py-2 max-w-sm border border-[var(--text-color)]/10 rounded-[16px]"
          style={{ "--translate-y": "200%" }}
        >
          <div class="flex gap-4 items-center justify-between">
            <p id="auto-redirect-timeout-countdown-text">
              Переход через <span id="auto-redirect-timeout-countdown">00</span>{" "}
              секунд
            </p>
            <div class="flex gap-2 items-center">
              <button
                id="auto-redirect-timeout-cancel"
                class={
                  "bg-[var(--text-color)] text-[var(--card-color)] px-4 py-2 rounded-[16px] cursor-pointer"
                }
              >
                Отменить
              </button>
            </div>
          </div>
        </div>
        <script src="/static/js/autoredirect.js"></script>
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
  type?: "profile" | "release" | "collection";
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
          {user.is_verified && (
            <span>
              <img
                src="/static/images/ic-verified.svg"
                style={{ width: 32, height: 32, marginLeft: 8 }}
              ></img>
            </span>
          )}
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

const YearSeason = [null, "Зима", "Весна", "Лето", "Осень"];
const ageRating = [null, "0+", "6+", "12+", "16+", "18+"];
const weekDay = [
  null,
  "каждый понедельник",
  "каждый вторник",
  "каждую среду",
  "каждый четверг",
  "каждую пятницу",
  "каждую субботу",
  "каждое воскресенье",
];

export const ReleaseCard = ({ release }: { release: any }) => {
  return (
    <div class="flex flex-col gap-4 p-8 bg-[var(--card-color)] border border-[var(--text-color)]/10 rounded-[32px] relative overflow-hidden">
      <img
        src={release.image}
        alt=""
        class="w-[256px] h-[320px] rounded-[32px] z-10 border-2 border-[var(--card-color)]/10 object-cover"
      />
      <div class="flex flex-col gap-2">
        <h1 class="text-[32px] wrap-anywhere leading-none my-2">
          {release.title_ru}
        </h1>
        <div class="text-[16px] wrap-anywhere leading-none my-2 text-[var(--text-color)]/50 -mt-1 flex flex-wrap gap-2 items-center">
          <span>{release.title_original}</span>
          {/* @ts-ignore */}
          {release.age_rating ? (
            ageRating[release.age_rating] ? (
              <span class="bg-white text-black px-1 py-0.5 rounded-[4px] text-xs">
                {/* @ts-ignore */}
                {ageRating[release.age_rating]}
              </span>
            ) : (
              ""
            )
          ) : (
            ""
          )}
        </div>
        <p
          class="line-clamp-4 transition-[max-height] max-h-[var(--max-h)]"
          id="release_desc"
          style={`--max-h: 100px;`}
        >
          {release.description}
        </p>
        <button
          id="release_expand"
          class="text-sm px-4 py-2 rounded-[32px] border border-[var(--text-color)]/10 hover:border-[var(--text-color)] transition-[border]"
        >
          Подробнее...
        </button>
        <script src="/static/js/release.js"></script>
      </div>
      <div class="flex flex-col gap-2">
        {release.country ? (
          <div class="flex gap-2 items-center">
            {release.country == "Япония" ? (
              <img
                src="/static/icons/twemoji_flag-japan.svg"
                class="w-[18px] h-[18px]"
              />
            ) : release.country == "Китай" ? (
              <img
                src="/static/icons/twemoji_flag-china.svg"
                class="w-[18px] h-[18px]"
              />
            ) : (
              <img
                src="/static/icons/twemoji_flag-united-nations.svg"
                class="w-[18px] h-[18px]"
              />
            )}
            <span>
              {release.country}
              {release.season ? ", " : ""}
              {release.season && YearSeason[release.season]
                ? YearSeason[release.season]
                : ""}
              {release.year ? " " : ""}
              {release.year ? `${release.year} г.` : ""}
            </span>
          </div>
        ) : (
          ""
        )}
        <div class="flex gap-2 items-center">
          <img
            src="/static/icons/mingcute_play-circle-line.svg"
            class="w-[18px] h-[18px]"
          />
          <span>
            {release.episodes_released ? release.episodes_released : "?"}
            {"/"}
            {release.episodes_total
              ? release.episodes_total + " эп. "
              : "? эп. "}
            {release.duration != 0
              ? `По ${minutesToTime(release.duration)}`
              : ""}
          </span>
        </div>
        <div class="flex gap-2 items-center leading-none">
          <img
            src="/static/icons/mingcute_calendar-2-line.svg"
            class="w-[18px] h-[18px]"
          />
          <span>
            {release.category ? release.category.name : "?"}
            {", "}
            {release.status ? release.status.name : "Анонс"}
            {release.broadcast != 0 ? ` ${weekDay[release.broadcast]}` : ""}
          </span>
        </div>
        <div class="flex gap-2 items-center">
          <img
            src="/static/icons/mingcute_user-3-line.svg"
            class="w-[18px] h-[18px]"
          />
          <div class="flex gap-1 flex-col flex-wrap text-balance leading-none">
            {release.studio && (
              <div>
                {"Студия: "}
                {release.studio}
              </div>
            )}
            {release.author && (
              <p>
                {"Автор: "}
                <span>{release.author}</span>
              </p>
            )}
            {release.director && (
              <p>
                {"Режиссёр: "}
                <span>{release.director}</span>
              </p>
            )}
          </div>
        </div>
        {release.source && (
          <div class={"flex gap-2 items-center"}>
            <img
              src="/static/icons/mingcute_camcorder-3-line.svg"
              class="w-[18px] h-[18px]"
            />
            <span>Источник: {release.source}</span>
          </div>
        )}
        {release.genres && (
          <div class="flex gap-2 items-center flex-wrap">
            {release.genres.split(",").map((genre: string) => (
              <div class="text-balance wrap-anywhere border border-[var(--text-color)]/50 rounded-[16px] px-2 py-1 text-[16px] flex gap-2 items-center">
                <img
                  src="/static/icons/mingcute_tag-2-line.svg"
                  class="w-[18px] h-[18px]"
                />
                <span>{genre}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CollectionCard = ({
  collection,
  releases,
}: {
  collection: any;
  releases: any;
}) => {
  return (
    <div class="flex flex-col gap-4 p-8 bg-[var(--card-color)] border border-[var(--text-color)]/10 rounded-[32px] relative overflow-hidden">
      <img
        src={collection.image}
        alt=""
        class="w-[256px] h-[144px] rounded-[32px] z-10 border-2 border-[var(--card-color)]/10 object-cover"
      />
      <div class="flex flex-col gap-2">
        <h1 class="text-[32px] wrap-anywhere leading-none my-2">
          {collection.title}
        </h1>
        <p
          class="line-clamp-4 transition-[max-height] max-h-[var(--max-h)]"
          id="release_desc"
          style={`--max-h: 100px;`}
        >
          {collection.description}
        </p>
        <button
          id="release_expand"
          class="text-sm px-4 py-2 rounded-[32px] border border-[var(--text-color)]/10 hover:border-[var(--text-color)] transition-[border] whitespace-pre-wrap"
        >
          Подробнее...
        </button>
        <script src="/static/js/release.js"></script>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex gap-6 items-center">
          <div class="flex gap-2 items-center">
            <img
              src="/static/icons/mingcute_bookmark-line.svg"
              class="w-[18px] h-[18px]"
            />
            {collection.favorites_count}
          </div>
          <div class="flex gap-2 items-center">
            <img
              src="/static/icons/mingcute_comment-2-line.svg"
              class="w-[18px] h-[18px]"
            />
            {collection.comment_count}
          </div>
        </div>
        {releases ? (
          <div class="flex gap-2 items-center">
            <img
              src="/static/icons/mingcute_play-circle-line.svg"
              class="w-[18px] h-[18px]"
            />
            {releases.total_count}{" "}
            {numberDeclension(
              releases.total_count,
              "релиз",
              "релиза",
              "релизов"
            )}
          </div>
        ) : (
          ""
        )}
        <div class="flex gap-2 items-center">
          <img
            src="/static/icons/mingcute_time-line.svg"
            class="w-[18px] h-[18px]"
          />
          {unixToDate(collection.last_update_date)}
        </div>
      </div>
    </div>
  );
};
