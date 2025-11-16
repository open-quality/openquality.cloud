module.exports = {
  problemStatements: {
    problem: {
      title: 'The Problem',
      summary: 'Modern software teams face scattered, unstructured, and invisible test data.',
      bullets: [
        'Test evidence lives in CI logs, chats, and spreadsheets',
        'No historical view of pass rates or quality trends',
        'Pricey enterprise tools charge $50-200 per user each month',
        'Complex, inflexible workflows slow down engineering teams'
      ]
    },
    solution: {
      title: 'The Solution',
      summary: 'OpenQuality centralizes execution data in a lightweight, self-hosted platform.',
      bullets: [
        'Complete visibility across every environment',
        'Actionable insights backed by clean historical data',
        'Zero licensing costs with permissive open source licensing',
        'Fast deployments so you can own the stack in minutes'
      ]
    }
  },
  features: [
    { icon: '🌌', title: 'Environment-aware visibility', description: 'Correlate builds, environments, and releases so every test has context.' },
    { icon: '📈', title: 'Quality insights', description: 'Capture pass rates, flakiness, and regression fingerprints without extra work.' },
    { icon: '🔗', title: 'Universal integration', description: 'REST API accepts payloads from GitHub Actions, Jenkins, GitLab, or any CLI.' },
    { icon: '🚀', title: 'Deploy in minutes', description: 'Single binary plus PostgreSQL means no heavyweight infrastructure.' },
    { icon: '💰', title: 'Zero licensing costs', description: 'Unlimited users and tests—perfect for startups and community teams.' },
    { icon: '🔒', title: 'Own your data', description: 'Self-hosted by default, so compliance and audits stay in your control.' }
  ],
  useCases: [
    { icon: '⚙️', title: 'CI/CD integration', description: 'Post execution payloads from any pipeline to keep a unified quality log.' },
    { icon: '🌐', title: 'Multi-environment testing', description: 'Track identical suites across dev, staging, and prod to spot drifts early.' },
    { icon: '📉', title: 'Regression analysis', description: 'Identify brittle tests and surface failure trends that block releases.' },
    { icon: '✅', title: 'Release confidence', description: 'Check health snapshots before promoting artifacts downstream.' },
    { icon: '📜', title: 'Compliance & audits', description: 'Maintain immutable execution history for regulated industries.' },
    { icon: '🤝', title: 'Team collaboration', description: 'Share curated dashboards with QA, platform, and product teams.' }
  ],
  audiences: [
    { title: 'Product & Platform Teams', description: 'Teams scaling testing beyond spreadsheets.', benefit: 'Bring enterprise capability without vendor lock-in.' },
    { title: 'DevOps & Infra', description: 'Engineer quality checkpoints into delivery pipelines.', benefit: 'APIs and CLI keep automation lightweight.' },
    { title: 'Regulated Orgs', description: 'Finance, healthcare, and aerospace teams with audit trails.', benefit: 'Self-hosted with full control over retention.' },
    { title: 'Open Source Projects', description: 'Communities who need transparent quality signals.', benefit: 'Zero cost and friendly contribution model.' }
  ],
  techStack: [
    { label: 'Backend', value: 'Golang + Echo framework' },
    { label: 'Frontend', value: 'Vue 3 + Quasar framework' },
    { label: 'Database', value: 'PostgreSQL powered by Bun ORM' },
    { label: 'CLI Tools', value: 'Cobra with go-pretty rendering' }
  ],
  quickStart: [
    '# COMING SOON!'
  ],
  docsSections: [
    { title: 'Architecture Overview', body: 'Understand the service boundaries (core API, CLI, UI) and how deployments plug into your platform teams.' },
    { title: 'API Reference', body: 'Use the REST endpoints to push test results, environments, and execution metadata from any CI pipeline.' },
    { title: 'Data Model & Storage', body: 'Capture builds, suites, and runs with PostgreSQL schemas you can extend via migrations.' },
    { title: 'Deployment Playbooks', body: 'Choose between Docker Compose, Helm charts, or bare-metal scripts depending on your infra.' }
  ]
}
