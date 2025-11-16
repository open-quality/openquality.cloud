---
layout: layouts/post.njk
title: We Paid a Luxury-Car Price for a Test Tool We Barely Use
date: 2024-11-25
summary: Two friends from automotive companies compare notes—one stuck with a pricey black-box testing platform, the other rolling out OpenQuality for free transparency.
permalink: "/blog/automotive-release-friend-chat/"
---
“Guess how much we just wired for that shiny cloud testing platform?” my friend Leo asked as we walked out of a supplier summit. “Six figures for the subscription alone. And we still can’t trace which build the tests ran against.”

Leo works for a major automotive brand—a maze of safety regulations, homologation labs, and release trains that run like clockwork until someone loses sight of the data. They were promised a turnkey solution: centralized dashboards, pipeline orchestration, enterprise support. The demo looked fantastic.

Reality? Every feature sits behind an upsell. Need multiple environments? Paid tier. Want more than five users? Paid tier. Historical context? Extra. Leo’s team now exports CSVs from the platform, pastes them into spreadsheets, and still can’t prove which software image actually passed compliance.

I told him what we’re doing at OpenQuality:

- **Unlimited users** out of the box—no seat counting.
- **Environment + SUT context** automatically attached to each test result.
- **REST and CLI ingest** so our Jenkins jobs, GitHub Actions, and in-car diagnostics all feed the same datastore.
- **Permanent history** so when homologation asks “what changed,” we pull up the timeline in seconds.

He raised an eyebrow. “On the free tier?”

“There is no tier,” I replied. “It’s open source. We run it locally for proof-of-concepts, then deploy the same container on our automotive-grade Kubernetes cluster. Same binary, same dashboards. No negotiations.”

Leo admitted their expensive platform can’t even tell which ECU firmware was validated last Tuesday. To get that insight, they would have to upgrade—again—and still export data for the regulators. Meanwhile, we point auditors to OpenQuality and hand them a permalink.

The meeting ended with the usual joke: “Maybe we should just expense another track car instead of vendor licenses.” But beneath the sarcasm was real frustration. Automotive software moves fast, and no one has time to babysit a black-box tool that hides the data.

OpenQuality doesn’t pretend to be flashy. It just answers the question every automotive team keeps asking: **What did we test, where, and when?** And it does it without the luxury-car price tag.
