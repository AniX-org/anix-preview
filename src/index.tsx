import { Hono } from "hono";
import { App, ButtonGroup, UserCard } from "./components";
import { ANIXART_HEADERS, API_BASE } from "./config";
import { tryCatchAPI } from "./tryCatch";
import { createOpenGraphImage } from "./utils.tsx";

function renderIndexPage(c: any) {
  return c.render(
    <App>
      <ButtonGroup></ButtonGroup>
    </App>
  );
}

const app = new Hono();
app.get(`/`, (c) => {
  return renderIndexPage(c);
});

app.get(`/profile/:id`, async (c) => {
  if (!c.req.param("id")) {
    return renderIndexPage(c);
  }

  // sourcery skip: combine-object-destructuring
  const { data: profileData, error: profileError } = await tryCatchAPI<any>(
    fetch(`${API_BASE}/profile/${c.req.param("id")}`, {
      method: "GET",
      headers: ANIXART_HEADERS,
    })
  );

  const { data: profileBlog } = await tryCatchAPI<any>(
    fetch(`${API_BASE}/channel/blog/${c.req.param("id")}`, {
      method: "GET",
      headers: ANIXART_HEADERS,
    })
  );

  if (profileError) {
    return renderIndexPage(c);
  }

  return c.render(
    <App
      pageTitle={`${profileData.profile.login} @ Anixart`}
      pageIcon={profileData.profile.avatar}
      openGraph={{
        url: c.req.url,
        description: profileData.profile.status,
        image: `${c.req.url}/opengraph`,
        imageWidth: 512,
        imageHeight: 512,
      }}
    >
      <div class="flex flex-col gap-8">
        <UserCard
          user={profileData.profile}
          blog={profileBlog ? profileBlog.channel : null}
        />
        <ButtonGroup type={`profile`} id={c.req.param("id")}></ButtonGroup>
      </div>
    </App>
  );
});

app.get(`/profile/:id/opengraph`, async (c) => {
  if (!c.req.param("id")) {
    return c.text("нет ID", 400);
  }

  // sourcery skip: combine-object-destructuring
  const { data: profileData, error: profileError } = await tryCatchAPI<any>(
    fetch(`${API_BASE}/profile/${c.req.param("id")}`, {
      method: "GET",
      headers: ANIXART_HEADERS,
    })
  );

  const { data: profileBlog } = await tryCatchAPI<any>(
    fetch(`${API_BASE}/channel/blog/${c.req.param("id")}`, {
      method: "GET",
      headers: ANIXART_HEADERS,
    })
  );

  if (profileError) {
    return c.text(profileError.message, 500);
  }

  return await createOpenGraphImage(
    profileData.profile,
    profileBlog ? profileBlog.channel : null
  );
});

export default app;
