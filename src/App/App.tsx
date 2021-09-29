import type {Candidate} from "../types/candidate";

import React, {useEffect, useState} from "react";

import api from "../api";

import styles from "./App.module.scss";

const STEPS: Candidate["step"][] = [
  "Entrevista inicial",
  "Entrevista técnica",
  "Oferta",
  "Asignación",
  "Rechazo",
];

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    api.candidates.list().then((res: Candidate[]) => {
      const cand: Candidate[] = JSON.parse(localStorage.getItem("candidato") || "[]");
      const fin: Candidate[] = res.concat(cand);

      cand[0] && setCandidates(fin);
      !cand[0] && setCandidates(res);
      setLoading(false);
    });
  }, []);

  const updateCandidate = (id: string, partial: Partial<Candidate>) => {
    let old: Candidate[] = JSON.parse(localStorage.getItem("candidato") || "[]");

    let newC: Candidate[] = old.map((cand) => (cand.id === id ? {...cand, ...partial} : cand));

    localStorage.setItem("candidato", JSON.stringify(newC));
    setCandidates((candidates) =>
      candidates.map((cand) =>
        cand.id === id
          ? {
              ...cand,
              ...partial,
            }
          : cand,
      ),
    );
  };

  const addCandidate = () => {
    const name = window.prompt("Nombre del candidato");
    const comment = window.prompt("Comentario del candidato");

    if (!name) return;

    let old: Candidate[] = JSON.parse(localStorage.getItem("candidato") || "[]");

    let newC: Candidate[] = old.concat({
      id: String(new Date().toLocaleTimeString()),
      name: name,
      comments: comment,
      step: "Entrevista inicial",
    } as Candidate);

    localStorage.setItem("candidato", JSON.stringify(newC));

    setCandidates((candidates) =>
      candidates.concat({
        id: String(new Date().toLocaleTimeString()),
        name: name,
        comments: comment,
        step: "Entrevista inicial",
      } as Candidate),
    );
  };

  const removeCandidate = (id: string) => {
    let old: Candidate[] = JSON.parse(localStorage.getItem("candidato") || "[]");
    let newC = old.filter((cand) => cand.id !== id);

    localStorage.setItem("candidato", JSON.stringify(newC));

    setCandidates((candidates) => candidates.filter((cand) => cand.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.columns}>
        {STEPS.map((step, index) => (
          <section key={step}>
            <h1>{step}</h1>
            {candidates[0] ? (
              candidates
                .filter((cand) => cand.step === step)
                .map((candidate: Candidate) => (
                  <article key={candidate.id} className={styles.card}>
                    <div>
                      <p className={styles.name}>{candidate.name}</p>
                      {candidate.comments && (
                        <p
                          className={styles.comment}
                          onClick={() =>
                            updateCandidate(candidate.id, {
                              comments:
                                window.prompt("Comentario del candidato", candidate.comments) || "",
                            })
                          }
                        >
                          {candidate.comments}
                        </p>
                      )}
                    </div>
                    <div className={styles.divButtons}>
                      <button onClick={() => removeCandidate(candidate.id)}>🗑️</button>
                      {index > 0 && (
                        <button
                          onClick={() =>
                            updateCandidate(candidate.id, {
                              step: STEPS[index - 1],
                            })
                          }
                        >
                          {"<<"}
                        </button>
                      )}
                      {index < STEPS.length - 1 && (
                        <button
                          onClick={() =>
                            updateCandidate(candidate.id, {
                              step: STEPS[index + 1],
                            })
                          }
                        >
                          {">>"}
                        </button>
                      )}
                    </div>
                  </article>
                ))
            ) : loading ? (
              <span>Cargando...</span>
            ) : null}
            {index === 0 && <button onClick={addCandidate}>Agregar Candidato</button>}
          </section>
        ))}
      </div>
    </div>
  );
}

export default App;
