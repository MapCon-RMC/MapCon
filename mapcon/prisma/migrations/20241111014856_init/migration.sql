-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "crawling";

-- CreateTable
CREATE TABLE "crawling"."crawling_news" (
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

-- CreateTable
CREATE TABLE "public"."agente" (
    "num_seq_agente" BIGINT NOT NULL,
    "forma_participacao_num_seq_forma_participacao" INTEGER NOT NULL,
    "participacao_agente_num_seq_participacao_agente" INTEGER,
    "protesto_num_seq_protesto" INTEGER,

    CONSTRAINT "agente_pkey" PRIMARY KEY ("num_seq_agente")
);

-- CreateTable
CREATE TABLE "public"."agente_protesto" (
    "num_seq_agente_protesto" SERIAL NOT NULL,
    "agente_protesto" VARCHAR(100) NOT NULL,
    "local_agente" VARCHAR(100),
    "categoria_agente_num_seq_categoria_agente" INTEGER NOT NULL,

    CONSTRAINT "agente_protesto_pkey" PRIMARY KEY ("num_seq_agente_protesto")
);

-- CreateTable
CREATE TABLE "public"."bairro" (
    "num_seq_bairro" SERIAL NOT NULL,
    "bairro" VARCHAR(100) NOT NULL,
    "cidade_num_seq_cidade" INTEGER,

    CONSTRAINT "bairro_pkey" PRIMARY KEY ("num_seq_bairro")
);

-- CreateTable
CREATE TABLE "public"."categoria_agente" (
    "num_seq_categoria_agente" SERIAL NOT NULL,
    "desc_categoria_agente" VARCHAR(100) NOT NULL,

    CONSTRAINT "categoria_agente_pkey" PRIMARY KEY ("num_seq_categoria_agente")
);

-- CreateTable
CREATE TABLE "public"."categoria_objeto" (
    "num_seq_categoria_objeto" SERIAL NOT NULL,
    "desc_categoria_objeto" VARCHAR(100) NOT NULL,

    CONSTRAINT "categoria_objeto_pkey" PRIMARY KEY ("num_seq_categoria_objeto")
);

-- CreateTable
CREATE TABLE "public"."cidade" (
    "num_seq_cidade" SERIAL NOT NULL,
    "cidade" VARCHAR(100) NOT NULL,

    CONSTRAINT "cidade_pkey" PRIMARY KEY ("num_seq_cidade")
);

-- CreateTable
CREATE TABLE "public"."conflito" (
    "num_seq_conflito" SERIAL NOT NULL,
    "desc_conflito" VARCHAR(100),
    "desc_detal_conflito" TEXT,
    "ident_conflito" VARCHAR(100) NOT NULL,

    CONSTRAINT "conflito_pkey" PRIMARY KEY ("num_seq_conflito")
);

-- CreateTable
CREATE TABLE "public"."desdobramento" (
    "num_seq_desdobramento" SERIAL NOT NULL,
    "descritor_desdobramento" TEXT,
    "desdobramento" VARCHAR(100) NOT NULL,
    "fonte_desdobramento" VARCHAR(100),
    "protesto_num_seq_protesto" INTEGER,

    CONSTRAINT "desdobramento_pkey" PRIMARY KEY ("num_seq_desdobramento")
);

-- CreateTable
CREATE TABLE "public"."documento" (
    "num_seq_documento" BIGINT NOT NULL,
    "caminho_documento" VARCHAR(1000),
    "mime_type" VARCHAR(100),
    "nome_documento" VARCHAR(1000),
    "protesto_num_seq_protesto" INTEGER,
    "byte_array" BYTEA,

    CONSTRAINT "documento_pkey" PRIMARY KEY ("num_seq_documento")
);

-- CreateTable
CREATE TABLE "public"."fonte" (
    "num_seq_fonte" SERIAL NOT NULL,
    "referencia" TEXT,
    "fonte_protesto_num_seq_fonte_protesto" INTEGER,
    "protesto_num_seq_protesto" INTEGER,

    CONSTRAINT "fonte_pkey" PRIMARY KEY ("num_seq_fonte")
);

-- CreateTable
CREATE TABLE "public"."fonte_protesto" (
    "num_seq_fonte_protesto" SERIAL NOT NULL,
    "desc_fonte_protesto" VARCHAR(100) NOT NULL,

    CONSTRAINT "fonte_protesto_pkey" PRIMARY KEY ("num_seq_fonte_protesto")
);

-- CreateTable
CREATE TABLE "public"."forma_participacao" (
    "num_seq_forma_participacao" SERIAL NOT NULL,
    "desc_forma_participacao" VARCHAR(100) NOT NULL,

    CONSTRAINT "forma_participacao_pkey" PRIMARY KEY ("num_seq_forma_participacao")
);

-- CreateTable
CREATE TABLE "public"."forma_protesto" (
    "num_seq_forma_protesto" SERIAL NOT NULL,
    "forma_protesto" VARCHAR(100) NOT NULL,
    "protesto_num_seq_protesto" INTEGER,
    "repertorio_acao_num_seq_repertorio_acao" INTEGER NOT NULL,

    CONSTRAINT "forma_protesto_pkey" PRIMARY KEY ("num_seq_forma_protesto")
);

-- CreateTable
CREATE TABLE "public"."geolocalizacao" (
    "num_seq_geolocalizacao" SERIAL NOT NULL,
    "nivel_exatidao" VARCHAR(100) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "protesto_num_seq_protesto" INTEGER,
    "raio" INTEGER NOT NULL,

    CONSTRAINT "geolocalizacao_pkey" PRIMARY KEY ("num_seq_geolocalizacao")
);

-- CreateTable
CREATE TABLE "public"."grafico" (
    "num_seq_grafico" BIGINT NOT NULL,
    "ano" INTEGER,
    "contador" INTEGER,
    "variavel" VARCHAR(100),

    CONSTRAINT "grafico_pkey" PRIMARY KEY ("num_seq_grafico")
);

-- CreateTable
CREATE TABLE "public"."grafico_limite" (
    "num_seq_grafico_limite" BIGINT NOT NULL,
    "cod" INTEGER,

    CONSTRAINT "grafico_limite_pkey" PRIMARY KEY ("num_seq_grafico_limite")
);

-- CreateTable
CREATE TABLE "public"."local" (
    "num_seq_local" SERIAL NOT NULL,
    "endereco" VARCHAR(100) NOT NULL,
    "origem_manifestacao" VARCHAR(100),
    "bairro_num_seq_bairro" INTEGER NOT NULL,
    "cidade_num_seq_cidade" INTEGER NOT NULL,
    "protesto_num_seq_protesto" INTEGER,

    CONSTRAINT "local_pkey" PRIMARY KEY ("num_seq_local")
);

-- CreateTable
CREATE TABLE "public"."objeto_protesto" (
    "num_seq_objeto_protesto" SERIAL NOT NULL,
    "descritor_objeto_protesto" TEXT,
    "objeto_protesto" VARCHAR(100) NOT NULL,
    "categoria_objeto_num_seq_categoria_objeto" INTEGER NOT NULL,
    "protesto_num_seq_protesto" INTEGER,

    CONSTRAINT "objeto_protesto_pkey" PRIMARY KEY ("num_seq_objeto_protesto")
);

-- CreateTable
CREATE TABLE "public"."participacao_agente" (
    "num_seq_participacao_agente" SERIAL NOT NULL,
    "agente_protesto_num_seq_agente_protesto" INTEGER NOT NULL,
    "forma_participacao_num_seq_forma_participacao" INTEGER NOT NULL,
    "protesto_num_seq_protesto" INTEGER,

    CONSTRAINT "participacao_agente_pkey" PRIMARY KEY ("num_seq_participacao_agente")
);

-- CreateTable
CREATE TABLE "public"."perfil_participante" (
    "num_seq_perfil_participante" BIGINT NOT NULL,
    "resposta9" VARCHAR(100),
    "resposta1" BIGINT NOT NULL,
    "resposta10" BIGINT NOT NULL,
    "resposta11" BIGINT NOT NULL,
    "resposta12" BIGINT NOT NULL,
    "resposta13" BIGINT NOT NULL,
    "resposta14" BIGINT NOT NULL,
    "resposta15" BIGINT NOT NULL,
    "resposta16" BIGINT NOT NULL,
    "resposta17" BIGINT NOT NULL,
    "resposta18" BIGINT NOT NULL,
    "resposta2" BIGINT NOT NULL,
    "resposta3" BIGINT NOT NULL,
    "resposta4" BIGINT NOT NULL,
    "resposta5" BIGINT NOT NULL,
    "resposta6" BIGINT NOT NULL,
    "resposta7" BIGINT NOT NULL,
    "resposta8" BIGINT NOT NULL,
    "protesto_num_seq_protesto" INTEGER,

    CONSTRAINT "perfil_participante_pkey" PRIMARY KEY ("num_seq_perfil_participante")
);

-- CreateTable
CREATE TABLE "public"."perfil_resposta" (
    "num_seq_perfil_resposta" BIGINT NOT NULL,
    "desc_perfil_resposta" VARCHAR(100),

    CONSTRAINT "perfil_resposta_pkey" PRIMARY KEY ("num_seq_perfil_resposta")
);

-- CreateTable
CREATE TABLE "public"."perfil_usuario" (
    "num_seq_perfil_usuario" BIGINT NOT NULL,
    "desc_perfil_usuario" VARCHAR(100) NOT NULL,

    CONSTRAINT "perfil_usuario_pkey" PRIMARY KEY ("num_seq_perfil_usuario")
);

-- CreateTable
CREATE TABLE "public"."protesto" (
    "num_seq_protesto" SERIAL NOT NULL,
    "data_protesto" TIMESTAMP(6) NOT NULL,
    "desc_detal_protesto" TEXT,
    "desc_protesto" VARCHAR(100),
    "ident_protesto" VARCHAR(100),
    "qtde_envolvidos_protesto" INTEGER,
    "tema_protesto" VARCHAR(400) NOT NULL,
    "conflito_num_seq_conflito" INTEGER,
    "usuario_num_seq_usuario" INTEGER,
    "status" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "protesto_pkey" PRIMARY KEY ("num_seq_protesto")
);

-- CreateTable
CREATE TABLE "public"."relatorio_geral" (
    "num_seq_relatorio_geral" BIGINT NOT NULL,
    "agente_protesto" VARCHAR(100),
    "bairro" VARCHAR(100),
    "cidade" VARCHAR(100),
    "data_protesto" TIMESTAMP(6),
    "desc_categoria_objeto" VARCHAR(100),
    "desc_detal_protesto" TEXT,
    "desc_fonte_protesto" VARCHAR(100),
    "desc_forma_participacao" VARCHAR(100),
    "desc_protesto" VARCHAR(100),
    "desc_repertorio_acao" VARCHAR(100),
    "descritor_desdobramento" TEXT,
    "descritor_objeto_protesto" TEXT,
    "desdobramento" VARCHAR(100),
    "endereco" VARCHAR(100),
    "fonte_desdobramento" VARCHAR(100),
    "forma_protesto" VARCHAR(100),
    "num_seq_protesto" BIGINT,
    "objeto_protesto" VARCHAR(100),
    "origem_manifestacao" VARCHAR(100),
    "qtde_envolvidos_protesto" INTEGER,
    "referencia" TEXT,
    "tema_protesto" VARCHAR(100),
    "verifica" INTEGER,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "relatorio_geral_pkey" PRIMARY KEY ("num_seq_relatorio_geral")
);

-- CreateTable
CREATE TABLE "public"."relatorio_geral_contador" (
    "num_seq_relatorio_geral_contador" BIGINT NOT NULL,
    "cont" INTEGER,
    "num_seq_protesto" BIGINT,

    CONSTRAINT "relatorio_geral_contador_pkey" PRIMARY KEY ("num_seq_relatorio_geral_contador")
);

-- CreateTable
CREATE TABLE "public"."repertorio_acao" (
    "num_seq_repertorio_acao" SERIAL NOT NULL,
    "desc_repertorio_acao" VARCHAR(100) NOT NULL,

    CONSTRAINT "repertorio_acao_pkey" PRIMARY KEY ("num_seq_repertorio_acao")
);

-- CreateTable
CREATE TABLE "public"."screenshot" (
    "id" VARCHAR(200) NOT NULL,
    "id_protesto" INTEGER NOT NULL,

    CONSTRAINT "screenshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usuario" (
    "num_seq_usuario" SERIAL NOT NULL,
    "usu_login" VARCHAR(50) NOT NULL,
    "usu_senha" VARCHAR(200) NOT NULL,
    "perfil_usuario_num_seq_perfil_usuario" BIGINT,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("num_seq_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_8fjuatstg8t2v75ltdydhh1ki" ON "public"."usuario"("usu_login");

-- AddForeignKey
ALTER TABLE "public"."agente" ADD CONSTRAINT "fk_6em2ejr0o8hhjxrtq4kbm4o25" FOREIGN KEY ("participacao_agente_num_seq_participacao_agente") REFERENCES "public"."participacao_agente"("num_seq_participacao_agente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."agente" ADD CONSTRAINT "fk_hm1stgs0d7yi29ry1as4envq7" FOREIGN KEY ("protesto_num_seq_protesto") REFERENCES "public"."protesto"("num_seq_protesto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."agente" ADD CONSTRAINT "fk_r8twfmg6aopkyp6g1aeii8ghj" FOREIGN KEY ("forma_participacao_num_seq_forma_participacao") REFERENCES "public"."forma_participacao"("num_seq_forma_participacao") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."agente_protesto" ADD CONSTRAINT "fk_sncxtqvw0l0s5lbqp838uxcmn" FOREIGN KEY ("categoria_agente_num_seq_categoria_agente") REFERENCES "public"."categoria_agente"("num_seq_categoria_agente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bairro" ADD CONSTRAINT "fk_3obh4bj7p7pxor0ecs426ak83" FOREIGN KEY ("cidade_num_seq_cidade") REFERENCES "public"."cidade"("num_seq_cidade") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."desdobramento" ADD CONSTRAINT "fk_f1m6ia6ed30awqdwpcn8aqwlf" FOREIGN KEY ("protesto_num_seq_protesto") REFERENCES "public"."protesto"("num_seq_protesto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."documento" ADD CONSTRAINT "fk_6786j9pfw77wjr2mdo34qsfwe" FOREIGN KEY ("protesto_num_seq_protesto") REFERENCES "public"."protesto"("num_seq_protesto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."fonte" ADD CONSTRAINT "fk_dwjpdjbmmdhtb6jda0iv6463d" FOREIGN KEY ("protesto_num_seq_protesto") REFERENCES "public"."protesto"("num_seq_protesto") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."fonte" ADD CONSTRAINT "fk_qcn6bmr0ft3w0jua43tbecqce" FOREIGN KEY ("fonte_protesto_num_seq_fonte_protesto") REFERENCES "public"."fonte_protesto"("num_seq_fonte_protesto") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."forma_protesto" ADD CONSTRAINT "fk_50ds2joxi11c7i7ieyhln6b1a" FOREIGN KEY ("repertorio_acao_num_seq_repertorio_acao") REFERENCES "public"."repertorio_acao"("num_seq_repertorio_acao") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."forma_protesto" ADD CONSTRAINT "fk_d0yabbeu6ovmjfo3vk7nwv1ya" FOREIGN KEY ("protesto_num_seq_protesto") REFERENCES "public"."protesto"("num_seq_protesto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."geolocalizacao" ADD CONSTRAINT "fk_f9fgsyedymyy26tqs5qtuuiwe" FOREIGN KEY ("protesto_num_seq_protesto") REFERENCES "public"."protesto"("num_seq_protesto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."local" ADD CONSTRAINT "fk_71efmcu2dreqbq3c3pio139b" FOREIGN KEY ("protesto_num_seq_protesto") REFERENCES "public"."protesto"("num_seq_protesto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."local" ADD CONSTRAINT "fk_co37ta4f7xcotyeep00n3mjfa" FOREIGN KEY ("bairro_num_seq_bairro") REFERENCES "public"."bairro"("num_seq_bairro") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."local" ADD CONSTRAINT "fk_p90vsdlkv0ka0c3g0af7riefd" FOREIGN KEY ("cidade_num_seq_cidade") REFERENCES "public"."cidade"("num_seq_cidade") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."objeto_protesto" ADD CONSTRAINT "fk_e6k7039w7f80by34t29sptd7x" FOREIGN KEY ("protesto_num_seq_protesto") REFERENCES "public"."protesto"("num_seq_protesto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."objeto_protesto" ADD CONSTRAINT "fk_nirqosm7ka9rfbxq9fofdrd57" FOREIGN KEY ("categoria_objeto_num_seq_categoria_objeto") REFERENCES "public"."categoria_objeto"("num_seq_categoria_objeto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."participacao_agente" ADD CONSTRAINT "fk_djwi7vxup7n4d3huw42mds6iu" FOREIGN KEY ("protesto_num_seq_protesto") REFERENCES "public"."protesto"("num_seq_protesto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."participacao_agente" ADD CONSTRAINT "fk_m6auofs5cl51gx55l77ldk3ev" FOREIGN KEY ("forma_participacao_num_seq_forma_participacao") REFERENCES "public"."forma_participacao"("num_seq_forma_participacao") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."participacao_agente" ADD CONSTRAINT "fk_morh3c97cmt0969vrqkbqgat2" FOREIGN KEY ("agente_protesto_num_seq_agente_protesto") REFERENCES "public"."agente_protesto"("num_seq_agente_protesto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_29u693jyqfbawkuo7tymr2ruf" FOREIGN KEY ("resposta13") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_2u381f1j4krc7hu1n86kth333" FOREIGN KEY ("resposta14") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_5092g6qd3mh0p9pb8xha35dbv" FOREIGN KEY ("resposta15") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_5d03mq142p5r75yuimw52wtqq" FOREIGN KEY ("resposta12") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_6354j8qki504mdwrtq3tbd1ug" FOREIGN KEY ("resposta6") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_6m4cgen9akpjoxkri4x55jes7" FOREIGN KEY ("resposta10") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_7mgxniwi4nwkjkwiijs35hcb7" FOREIGN KEY ("resposta4") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_864r6go46k6qighguwvd4ddu3" FOREIGN KEY ("resposta11") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_8lbg7ywftugtd75e256kmtnx9" FOREIGN KEY ("resposta3") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_b86v4nfd13tp2p5qt6eubc7xo" FOREIGN KEY ("resposta17") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_gxpdou5x33xaae5kle5y4pdm2" FOREIGN KEY ("resposta1") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_hwrf3sy41r6u40hn1k0723kip" FOREIGN KEY ("resposta2") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_i2bqsl0g48eqhhop4kjqccksl" FOREIGN KEY ("protesto_num_seq_protesto") REFERENCES "public"."protesto"("num_seq_protesto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_ll3c8rkvogxxe588l909fkd7h" FOREIGN KEY ("resposta18") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_m3345hgxosjftpsujhidq5ym4" FOREIGN KEY ("resposta5") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_n659gb6uknbxsyj196kvy1l1y" FOREIGN KEY ("resposta8") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_r710f8fmcreft5myloyvbfy35" FOREIGN KEY ("resposta7") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfil_participante" ADD CONSTRAINT "fk_svpfe6daqiosnpjev9288hx6" FOREIGN KEY ("resposta16") REFERENCES "public"."perfil_resposta"("num_seq_perfil_resposta") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."protesto" ADD CONSTRAINT "fk_4qqlt8gw1lo3hwrepga2tajtk" FOREIGN KEY ("usuario_num_seq_usuario") REFERENCES "public"."usuario"("num_seq_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."protesto" ADD CONSTRAINT "fk_o5qfdumcje5tolpbms8apmjn" FOREIGN KEY ("conflito_num_seq_conflito") REFERENCES "public"."conflito"("num_seq_conflito") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."usuario" ADD CONSTRAINT "fk_taqxc6xa8buti1t6r49yo7gw5" FOREIGN KEY ("perfil_usuario_num_seq_perfil_usuario") REFERENCES "public"."perfil_usuario"("num_seq_perfil_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Create mapa_protestos VIEW
CREATE MATERIALIZED VIEW "public"."mapa_protestos" AS SELECT num_seq_protesto, tema_protesto, to_char(data_protesto,'DD/MM/YYYY') as "data", latitude, longitude FROM protesto p  INNER JOIN geolocalizacao g ON p.num_seq_protesto = g.protesto_num_seq_protesto  WHERE status = 1 WITH DATA;