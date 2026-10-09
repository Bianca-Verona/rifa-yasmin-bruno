
"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const TOTAL_NUMBERS = 1000;
const PAGE_SIZE = 100;
const PRICE = 20;

type RaffleNumber = {
  numero: number;
  status: "disponivel" | "reservado" | "confirmado";
};

const numbers = Array.from({ length: TOTAL_NUMBERS }, (_, index) =>
  String(index + 1).padStart(3, "0")
);

export default function Home() {
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [raffleNumbers, setRaffleNumbers] = useState<RaffleNumber[]>([]);
  const [loadingNumbers, setLoadingNumbers] = useState(true);
  const [numbersError, setNumbersError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadNumbers() {
      setLoadingNumbers(true);
      setNumbersError("");

      const { data, error } = await supabase
        .from("numeros_rifa")
        .select("numero, status")
        .order("numero", { ascending: true });

      if (!active) return;

      if (error) {
        console.error("Erro ao carregar números:", error.message);
        setNumbersError(
          "Não foi possível carregar os números. Confira a conexão com o Supabase."
        );
        setRaffleNumbers([]);
      } else {
        setRaffleNumbers((data ?? []) as RaffleNumber[]);
      }

      setLoadingNumbers(false);
    }

    loadNumbers();

    return () => {
      active = false;
    };
  }, []);

  const filteredNumbers = useMemo(() => {
    const start = page * PAGE_SIZE;
    return numbers.slice(start, start + PAGE_SIZE);
  }, [page]);

  const exactSearch = search.trim().replace(/\D/g, "");

  const searchResult = useMemo(() => {
    if (!exactSearch || exactSearch.length > 4) return null;

    const value = Number(exactSearch);

    if (value < 1 || value > TOTAL_NUMBERS) return null;

    return String(value).padStart(3, "0");
  }, [exactSearch]);

  const visibleNumbers =
    searchResult && search.trim() !== ""
      ? [searchResult]
      : filteredNumbers;

  const raffleNumberMap = useMemo(
    () =>
      new Map(
        raffleNumbers.map((item) => [
          String(item.numero).padStart(3, "0"),
          item,
        ])
      ),
    [raffleNumbers]
  );

  const total = selectedNumbers.length * PRICE;

  function toggleNumber(number: string) {
    const record = raffleNumberMap.get(number);

    // Esta seleção ainda é local, não cria uma reserva no banco.
    if (!record || record.status !== "disponivel") return;

    setSelectedNumbers((current) =>
      current.includes(number)
        ? current.filter((item) => item !== number)
        : [...current, number].sort(
            (a, b) => Number(a) - Number(b)
          )
    );
  }

  function goToPage(nextPage: number) {
    setPage(Math.max(0, Math.min(9, nextPage)));
    setSearch("");
  }

  return (
    <main>
      <header className="header">
        <div className="container header-content">
          <a href="#inicio" className="brand">
            Yasmin &amp; Bruno <span>♥</span>
          </a>

          <nav>
            <a href="#inicio">Início</a>
            <a href="#premios">Prêmios</a>
            <a href="#como-participar">Como participar</a>
            <a href="#numeros">Números</a>
          </nav>

          <a href="#numeros" className="header-button">
            ♥ Quero participar
          </a>
        </div>
      </header>

      <section id="inicio" className="hero">
        <div className="hero-decoration hero-decoration-one">♡</div>
        <div className="hero-decoration hero-decoration-two">♡</div>

        <div className="container hero-grid">
          <div className="hero-text">
            <span className="eyebrow">Yasmin &amp; Bruno</span>

            <h1>
              Rifa do
              <br />
              <span>nosso grande sonho!</span>
            </h1>

            <div className="brush-line">
              Rumo ao nosso felizes para sempre. ♥
            </div>

            <p>
              Estamos vivendo uma fase muito especial e preparando
              o nosso casamento. O Bruno resolveu colocar seu trabalho
              em ação para ajudar nos preparativos desse sonho!
            </p>

            <div className="hero-info">
              <div>
                <span className="info-icon">♡</span>
                <strong>Nosso casamento</strong>
                <small>Um sonho a dois</small>
              </div>

              <div>
                <span className="info-icon">🚗</span>
                <strong>Serviço especial</strong>
                <small>Feito com carinho</small>
              </div>

              <div>
                <span className="info-icon">♥</span>
                <strong>Você participa</strong>
                <small>Ajude nosso sonho</small>
              </div>
            </div>

            <a href="#numeros" className="primary-button">
              Conhecer a seleção →
            </a>
          </div>

          <div className="hero-image">
            <div className="price-sticker">
              <small>Valor por número</small>
              <strong>R$ 20</strong>
              <span>Um sonho a dois ♥</span>
            </div>

            <div className="car-photo">
              <div className="photo-overlay">
                <span>Seu carro</span>
                <strong>merece esse cuidado!</strong>
              </div>
            </div>

            <div className="heart-stamp">♥</div>
          </div>
        </div>
      </section>

      <section id="premios" className="section prizes-section">
        <div className="container">
          <div className="section-heading">
            <span>♥ Conheça os prêmios</span>
            <h2>Um cuidado especial para o seu carro</h2>
          </div>

          <div className="prizes-grid">
            <article className="prize-card first">
              <div className="medal">1º</div>
              <span className="prize-number">1º prêmio</span>
              <h3>Higienização interna</h3>
              <p>
                Interior limpo, renovado e com aquele cuidado
                que seu carro merece.
              </p>
            </article>

            <article className="prize-card second">
              <div className="medal">2º</div>
              <span className="prize-number">2º prêmio</span>
              <h3>Enceramento técnico</h3>
              <p>
                Brilho, proteção e aparência renovada para o seu carro.
              </p>
            </article>

            <article className="prize-card third">
              <div className="medal">3º</div>
              <span className="prize-number">3º prêmio</span>
              <h3>Lavagem técnica detalhada</h3>
              <p>
                Limpeza detalhada com atenção a cada acabamento.
              </p>
            </article>
          </div>

          <div className="home-prize">
            <div className="home-prize-icon">⌂</div>
            <div>
              <span>♥ E não tem carro? Sem problema!</span>
              <h3>O cuidado também pode chegar à sua casa.</h3>
              <p>
                A possibilidade de conversão em limpeza de estofados,
                como sofá ou colchão, deverá seguir as regras definidas
                para a ação.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="como-participar" className="section how-section">
        <div className="container">
          <div className="section-heading">
            <span>♥ Entenda as etapas</span>
            <h2>Como funciona?</h2>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <h3>Consulte os números</h3>
              <p>Encontre um número usando a busca ou as faixas.</p>
            </div>

            <div className="step">
              <div className="step-number">02</div>
              <h3>Confira os detalhes</h3>
              <p>Veja as condições e as regras da ação.</p>
            </div>

            <div className="step">
              <div className="step-number">03</div>
              <h3>Consulte a participação</h3>
              <p>
                As instruções serão publicadas após a definição do formato.
              </p>
            </div>

            <div className="step">
              <div className="step-number">04</div>
              <h3>Acompanhe as novidades</h3>
              <p>Fique por dentro das atualizações do casal.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="numeros" className="section numbers-section">
        <div className="container">
          <div className="section-heading">
            <span>♥ Explore os números</span>
            <h2>Encontre o seu número</h2>
            <p className="selector-intro">
              São 1.000 números organizados para facilitar a consulta.
            </p>
          </div>

          <div className="selector-panel">
            <div className="selector-top">
              <div className="selector-stat">
                <span>Total cadastrado</span>
                <strong>
                  {loadingNumbers ? "…" : raffleNumbers.length}
                </strong>
              </div>

              <div className="selector-stat">
                <span>Valor de referência</span>
                <strong>R$ 20,00</strong>
              </div>

              <div className="selector-stat">
                <span>Na sua seleção</span>
                <strong>{selectedNumbers.length}</strong>
              </div>
            </div>

            <label className="search-box">
              <span className="search-icon">⌕</span>

              <input
                type="search"
                inputMode="numeric"
                placeholder="Buscar número, ex.: 027"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Buscar número"
              />

              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearch("")}
                >
                  Limpar
                </button>
              )}
            </label>

            {searchResult && search.trim() !== "" && (
              <p className="search-feedback">
                Número encontrado: <strong>{searchResult}</strong>
              </p>
            )}

            {search.trim() !== "" && !searchResult && (
              <p className="search-feedback">
                Digite um número entre 001 e 1000.
              </p>
            )}

            <div className="range-heading">
              <div>
                <span>Explore por faixa</span>
                <p>Escolha uma faixa para consultar seus números.</p>
              </div>

              {search.trim() === "" && (
                <span className="range-count">
                  {String(page * PAGE_SIZE + 1).padStart(3, "0")}
                  {" – "}
                  {String((page + 1) * PAGE_SIZE).padStart(3, "0")}
                </span>
              )}
            </div>

            {search.trim() === "" && (
              <div className="range-tabs">
                {Array.from({ length: 10 }, (_, index) => {
                  const start = index * PAGE_SIZE + 1;
                  const end = (index + 1) * PAGE_SIZE;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => goToPage(index)}
                      className={`range-tab ${
                        page === index ? "active" : ""
                      }`}
                      aria-pressed={page === index}
                    >
                      <strong>
                        {String(start).padStart(3, "0")}
                        {"–"}
                        {String(end).padStart(3, "0")}
                      </strong>
                      <span>Faixa {index + 1}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="number-legend">
              <span>
                <i className="legend-available" /> Disponível na consulta
              </span>
              <span>
                <i className="legend-selected" /> Selecionado por você
              </span>
              <span>
                <i className="legend-unavailable" /> Indisponível
              </span>
            </div>

            {loadingNumbers && (
              <p className="search-feedback">Carregando números...</p>
            )}

            {numbersError && (
              <p className="search-feedback" role="alert">
                {numbersError}
              </p>
            )}

            {!loadingNumbers && !numbersError && (
              <div className="numbers-grid">
                {visibleNumbers.map((number) => {
                  const record = raffleNumberMap.get(number);
                  const unavailable =
                    !record || record.status !== "disponivel";
                  const selected = selectedNumbers.includes(number);

                  return (
                    <button
                      key={number}
                      type="button"
                      onClick={() => toggleNumber(number)}
                      disabled={unavailable}
                      className={`number ${
                        selected ? "selected-number" : ""
                      } ${
                        unavailable ? "unavailable-number" : ""
                      }`}
                      aria-pressed={selected}
                      aria-label={`Número ${number}${
                        unavailable
                          ? ", indisponível"
                          : selected
                            ? ", selecionado"
                            : ", disponível"
                      }`}
                      title={
                        unavailable
                          ? "Este número não está disponível"
                          : "Selecionar número"
                      }
                    >
                      {number}
                      {selected && (
                        <span className="number-check">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {!loadingNumbers &&
              !numbersError &&
              visibleNumbers.length === 0 && (
                <p className="no-results">
                  Nenhum número para mostrar.
                </p>
              )}

            {search.trim() === "" && (
              <div className="pagination">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 0}
                >
                  ← Anterior
                </button>

                <span>Faixa {page + 1} de 10</span>

                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === 9}
                >
                  Próxima →
                </button>
              </div>
            )}

            <p className="demo-notice">
              Protótipo em integração: a seleção ainda é local e não cria
              reservas ou pagamentos. A disponibilidade exibida reflete
              o banco no momento do carregamento.
            </p>
          </div>
        </div>
      </section>

      <section className="payment-section">
        <div className="container payment-grid">
          <div>
            <span className="payment-label">Nosso grande sonho</span>
            <h2>Um passo de cada vez, rumo ao altar.</h2>
            <p>
              Estamos preparando as informações e as condições da ação.
              Os dados de participação e pagamento serão divulgados
              quando o formato estiver definido.
            </p>
          </div>

          <div className="pix-card">
            <span>Informações</span>
            <strong>Yasmin &amp; Bruno</strong>
            <small>Novidades em breve</small>
          </div>

          <div className="draw-date">
            <span>Data inicialmente prevista</span>
            <strong>19/12/2026</strong>
            <small>Sujeita à confirmação</small>
          </div>
        </div>
      </section>

      <section className="final-section">
        <div className="container">
          <span>♥ Obrigado por acompanhar</span>
          <h2>
            Yasmin <em>&amp;</em> Bruno
          </h2>
          <p>Rumo ao nosso felizes para sempre. ✨</p>
          <div className="final-decoration">♡</div>
        </div>
      </section>

      <footer>
        <div className="container">
          <strong>Yasmin &amp; Bruno</strong>
          <span>Nosso grande sonho ♥</span>
        </div>
      </footer>

      {selectedNumbers.length > 0 && (
        <div className="selection-bar">
          <div className="selection-bar-info">
            <span>Sua seleção</span>
            <strong>
              {selectedNumbers.length}{" "}
              {selectedNumbers.length === 1 ? "número" : "números"}
              {" · "}
              R$ {total.toFixed(2).replace(".", ",")}
            </strong>
          </div>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("resumo-selecao")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Ver seleção ↓
          </button>
        </div>
      )}

      <div id="resumo-selecao" className="selection-summary">
        {selectedNumbers.length > 0 && (
          <div className="container">
            <h3>Resumo da seleção</h3>
            <p>{selectedNumbers.join(", ")}</p>
            <strong>
              {selectedNumbers.length} números · R${" "}
              {total.toFixed(2).replace(".", ",")}
            </strong>
            <button
              type="button"
              onClick={() => setSelectedNumbers([])}
            >
              Limpar seleção
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
