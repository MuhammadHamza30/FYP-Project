import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MainSidebar } from "../../components";
import { askGemini } from "../../utils";
import { addPrompt, getPrompts } from "../../APIS";
import { FiZap, FiArrowUpRight } from "react-icons/fi";
export const AiHelper = () => {
  const { user } = useSelector((s) => s.user);
  const [data, setData] = useState([]),
    [question, setQuestion] = useState(""),
    [loading, setLoading] = useState(false),
    [error, setError] = useState("");
  const busy = useRef(false);
  const configured = !!process.env.REACT_APP_AI_ENDPOINT;
  useEffect(() => {
    let active = true;
    getPrompts(user.docId)
      .then((rows) => {
        if (active) setData(rows);
      })
      .catch(() => {
        if (active) setError("Previous conversations could not be loaded.");
      });
    return () => {
      active = false;
    };
  }, [user.docId]);
  const submit = async (event) => {
    event.preventDefault();
    const text = question.trim();
    if (busy.current || !text || !configured) return;
    busy.current = true;
    setLoading(true);
    setError("");
    try {
      const answer = await askGemini(text);
      const record = await addPrompt({
        userId: user.docId,
        question: text,
        answer,
      });
      setData((previous) => [...previous, record]);
      setQuestion("");
    } catch (e) {
      setError(e.message);
    } finally {
      busy.current = false;
      setLoading(false);
    }
  };
  return (
    <MainSidebar>
      <div className="page-heading">
        <div>
          <span className="eyebrow">A LITTLE EXTRA GUIDANCE</span>
          <h1>AI assistant</h1>
          <p>Explore training ideas and general squash questions.</p>
        </div>
        <span className="feature-icon">
          <FiZap />
        </span>
      </div>
      {!configured && (
        <div className="alert alert-info">
          The assistant is not connected yet. Your administrator needs to
          configure its server endpoint.
        </div>
      )}
      <section className="panel ai-panel">
        <div className="conversation" aria-live="polite">
          {!data.length && (
            <div className="empty-state">
              <FiZap />
              <h3>What’s on your mind?</h3>
              <p>
                Ask about technique, training routines, or preparing for your
                next match.
              </p>
            </div>
          )}
          {data.map((item) => (
            <article className="chat-turn" key={item.docId}>
              <div className="chat-question">
                <small>YOU</small>
                <p>{item.question}</p>
              </div>
              <div className="chat-answer">
                <small>SPMS ASSISTANT</small>
                <p>{item.answer}</p>
              </div>
            </article>
          ))}
          {loading && <p role="status">Preparing your answer…</p>}
        </div>
        {error && (
          <div role="alert" className="alert alert-danger">
            {error}
          </div>
        )}
        <form className="chat-composer" onSubmit={submit}>
          <input
            className="form-control"
            aria-label="Your question"
            placeholder="Ask a squash question…"
            value={question}
            maxLength={3000}
            disabled={!configured || loading}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            className="btn primary-button"
            disabled={!configured || loading || !question.trim()}
            type="submit"
          >
            {loading ? (
              "Sending…"
            ) : (
              <>
                Send <FiArrowUpRight />
              </>
            )}
          </button>
        </form>
        <small className="text-muted">
          AI responses can be inaccurate. For medical advice, speak with your
          doctor.
        </small>
      </section>
    </MainSidebar>
  );
};
