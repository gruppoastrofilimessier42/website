# Shared configuration between environments
FROM freinet/postfix-relay as base

# Development environment
FROM base as development

# Production environment
FROM base as production
RUN apt-get update && apt-get install -y nmap mutt
COPY ./.scripts/healthcheck.sh /usr/local/bin
RUN chmod +x /usr/local/bin/healthcheck.sh
HEALTHCHECK --interval=3s --timeout=2s --start-period=2s --retries=10 CMD [ "healthcheck.sh" ]
