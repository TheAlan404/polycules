# polycules by deniz

If you are a polyamorous person who has been in a polycule before, you might have seen the website [polycul.es](https://polycul.es) made by [makyo](https://github.com/makyo/polycul.es)

The thing is, people I know who are poly have [plural systems](https://morethanone.info) and that website has no way to represent that in a nice way.

This project fixes that, and I've also tried to make it responsive and mobile-accessible!

You can access it live over on [poly.deniz.blue](https://poly.deniz.blue)

It still needs a ton of improvements in my opinion tho (~March 2025)

## Development/Contributing

This repo is a monorepo pnpm workspace.

- Frontend: `pnpm dev` on `app/frontend`
- Backend: `pnpm dev` on `app/backend`
- Deployment: docker

## TODO

- A better backend database, maybe use prisma with postgres. It's 2025 why did I use a jsondb wtf
- Importing from other places
- Maybe just rewrite the entire system, make users "log in" with third party stuff and have them connect each other? idk
