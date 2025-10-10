# 기본 프로젝트 설정

이 문서는 `problem-bank-server`의 초기 설정 과정을 설명합니다.

## 1. NestJS 프로젝트 생성

NestJS CLI를 사용하여 프로젝트를 생성했습니다.

```bash
npx @nestjs/cli new problem-bank-server --package-manager npm
```

## 2. Docker 기반 PostgreSQL 설정

Docker 컨테이너에서 PostgreSQL 데이터베이스를 실행하기 위한 `docker-compose.yml` 파일을 생성했습니다.

**`docker-compose.yml`:**

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:13
    container_name: problem-bank-postgres
    restart: always
    environment:
      POSTGRES_DB: problem-bank
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - '5433:5432' # 5432 포트 충돌로 인해 호스트 포트를 5433으로 변경
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 3. 서비스 구성 및 실행

### 애플리케이션 포트 변경

기본 NestJS 포트를 `3000`에서 `8090`으로 변경했습니다.

- **파일:** `src/main.ts`
- **변경사항:** `await app.listen(process.env.PORT ?? 3000);`을 `await app.listen(process.env.PORT ?? 8090);`으로 수정

### 서비스 실행

1.  **데이터베이스 시작:**
    ```bash
    docker-compose up -d
    ```
2.  **NestJS 애플리케이션 시작:**
    ```bash
    npm run start:dev
    ```

## 4. 확인

- 애플리케이션: `http://localhost:8090` 접속 가능
- 데이터베이스: `localhost:5433` 접속 가능
