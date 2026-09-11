import Link from "next/link";
import type { ReactNode } from "react";

const DECLARE = `#[injectable]
pub struct UserService;

#[controller("/users")]
pub struct UserController {
    #[inject]
    service: UserService,
}

#[routes]
impl UserController {
    #[get("/{id}")]
    async fn find_one(&self, Path(id): Path<u32>) -> HttpResponse {
        match self.service.find(id) {
            Some(user) => HttpResponse::ok().json(json!(user)).build(),
            None => HttpResponse::not_found().build(),
        }
    }
}

#[module(controllers: [UserController], providers: [UserService])]
impl AppModule {}`;

const SERVE = `let mut app = UloFactory::create(AppModule).await?;

// The only line that names a server.
app.use_http_adapter(AxumAdapter::new(), ("0.0.0.0", 3000))?;

app.start().await?;`;

/**
 * Attributes carry the meaning in a Ulo file, so they are the only thing
 * tinted. Matched by line rather than by a bracket-balancing regex, because
 * `#[module(controllers: [X], providers: [Y])]` nests brackets.
 */
function highlight(line: string): ReactNode {
  const trimmed = line.trimStart();
  if (trimmed === "") return " ";
  if (trimmed.startsWith("//"))
    return <span className="text-fd-muted-foreground">{line}</span>;
  if (trimmed.startsWith("#["))
    return <span className="text-brand">{line}</span>;
  return line;
}

function Code({ code, label }: { code: string; label: string }) {
  return (
    <figure className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-fd-card">
      <figcaption className="border-b px-4 py-2 font-mono text-xs tracking-wide text-fd-muted-foreground">
        {label}
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code>
          {code.split("\n").map((line, i) => (
            <span key={i} className="block">
              {highlight(line) ?? " "}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

function Section({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6 border-t py-14">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-balance">
          {title}
        </h2>
        {lede ? (
          <p className="max-w-[62ch] text-fd-muted-foreground">{lede}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

const ADAPTERS = [
  { name: "ulo-http-axum", on: "axum", note: "streaming bodies, WebSocket on either port" },
  { name: "ulo-http-actix", on: "actix-web", note: "buffered bodies, no WebSocket" },
  { name: "ulo-http-salvo", on: "salvo", note: "streaming bodies, WebSocket on either port" },
  { name: "ulo-http-poem", on: "poem", note: "streaming bodies, WebSocket on either port" },
  { name: "ulo-http-rocket", on: "rocket", note: "same-port WebSocket, binds its own socket" },
];

const TRANSPORTS = [
  {
    name: "HTTP",
    detail: "Controllers, extractors, SSE. Middleware runs before routing, so it sees 404s and upgrades.",
  },
  {
    name: "WebSocket",
    detail: "Gateways with message handlers, rooms, and broadcasting. Same port as HTTP, or its own.",
  },
  {
    name: "RPC",
    detail: "Pattern-matched handlers over TCP, UDP, NATS, Redis, RabbitMQ, MQTT, or Kafka.",
  },
  {
    name: "gRPC",
    detail: "Contract-first services on tonic, all four streaming modes. Guards and interceptors apply; pipes do not.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-24">
      <header className="flex items-center justify-between py-6">
        <span className="font-semibold tracking-tight text-brand">ulo</span>
        <nav className="flex items-center gap-5 text-sm text-fd-muted-foreground">
          <Link className="transition-colors hover:text-fd-foreground" href="/docs">
            Docs
          </Link>
          <Link
            className="transition-colors hover:text-fd-foreground"
            href="/docs/coming-from-nestjs"
          >
            From NestJS
          </Link>
          <a
            className="transition-colors hover:text-fd-foreground"
            href="https://github.com/ulo-rs/ulo"
          >
            GitHub
          </a>
        </nav>
      </header>

      <section className="flex flex-col gap-7 py-14">
        <h1 className="max-w-[18ch] text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl">
          Structure for Rust services.
        </h1>
        <p className="max-w-[58ch] text-lg leading-relaxed text-fd-muted-foreground">
          Ulo organizes an application into modules, controllers, and injectable
          services, then runs every request through the same guard, interceptor,
          and pipe chain. It is not an HTTP server — you keep that choice.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/docs/getting-started/quick-start"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
          <Link
            href="/docs/coming-from-nestjs"
            className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-fd-accent"
          >
            Coming from NestJS
          </Link>
          <code className="rounded-lg border bg-fd-card px-3 py-2 font-mono text-sm text-fd-muted-foreground">
            cargo add ulo ulo-http-axum
          </code>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Code code={DECLARE} label="src/app/users.rs" />
        <Code code={SERVE} label="src/main.rs" />
      </div>

      <Section
        eyebrow="Adapters"
        title="One API, five servers."
        lede="Application code never names the adapter. It is registered at runtime and held as a boxed trait object, so swapping the server underneath is a one-line change — and writing a sixth is a trait impl."
      >
        <ul className="flex flex-col divide-y rounded-xl border">
          {ADAPTERS.map((a) => (
            <li
              key={a.name}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-3"
            >
              <span className="font-mono text-sm text-brand">{a.name}</span>
              <span className="text-sm text-fd-muted-foreground">
                on {a.on} — {a.note}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="Transports"
        title="The same chain, wherever the request came from."
        lede="Guards, interceptors, pipes, and error handlers are generic over the context type. One struct can implement a trait for several transports and serve all of them."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {TRANSPORTS.map((t) => (
            <div key={t.name} className="rounded-xl border bg-fd-card p-4">
              <h3 className="font-medium">{t.name}</h3>
              <p className="mt-1 text-sm text-fd-muted-foreground">{t.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Around it"
        title="The parts an application needs anyway."
        lede="Each ships as its own crate and registers as a module, so nothing you skip is compiled in."
      >
        <div className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
          {[
            ["Databases", "SeaORM, SQLx, Diesel, MongoDB, Redis, and Prisma, each with a startup reachability check"],
            ["Configuration", "typed config from env or file, validated at load"],
            ["Health checks", "HTTP, memory, and disk indicators behind one endpoint"],
            ["GraphQL", "async-graphql or juniper, with WebSocket subscriptions"],
            ["CLI", "ulo new, ulo generate resource, and a watching ulo dev"],
            ["Lifecycle", "init and shutdown hooks, and a graceful drain you control"],
          ].map(([name, detail]) => (
            <div key={name} className="flex flex-col gap-0.5 border-t pt-3">
              <span className="font-medium">{name}</span>
              <span className="text-fd-muted-foreground">{detail}</span>
            </div>
          ))}
        </div>
      </Section>

      <section className="flex flex-col items-start gap-4 border-t py-14">
        <h2 className="text-2xl font-semibold tracking-tight">
          Build the thing.
        </h2>
        <p className="max-w-[58ch] text-fd-muted-foreground">
          The quick start goes from an empty directory to a running API with a
          controller, a service, and a wired module.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/getting-started/quick-start"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
          >
            Quick start
          </Link>
          <Link
            href="/docs"
            className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-fd-accent"
          >
            Read the docs
          </Link>
        </div>
      </section>
    </main>
  );
}
