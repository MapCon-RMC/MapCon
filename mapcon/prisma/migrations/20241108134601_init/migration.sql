-- CreateTable
CREATE TABLE "crawling_news" (
    "url" VARCHAR(500) NOT NULL,
    "cidades" JSONB NOT NULL,
    "titulo" VARCHAR(500) NOT NULL,
    "termos" VARCHAR(50)[],
    "content" TEXT,
    "data" DATE NOT NULL,
    "processada" BOOLEAN,
    "tipo" BOOLEAN,
    "data_insercao" DATE,

    CONSTRAINT "crawling_news_pkey" PRIMARY KEY ("url")
);
