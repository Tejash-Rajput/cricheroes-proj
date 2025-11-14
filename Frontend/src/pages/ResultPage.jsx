import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResultPage() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('cricData');
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!data) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;

  const { team, opponent, overs, calculationResult, pointsTable, performanceRange } = data;

  const isBattingFirst = calculationResult.minRestrictRuns !== undefined;

  return (
    <div
      style={{
        maxWidth: 780,
        margin: '2.5rem auto',
        fontFamily: 'Montserrat, Arial, sans-serif',
        padding: 40,
        borderRadius: 18,
        background: '#fbfcfd',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        border: '1px solid #eaeef2',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontWeight: 700,
          letterSpacing: '0.06em',
          fontSize: 26,
          marginBottom: 34,
          color: '#142850',
        }}
      >
        IPL Table Performance Range
      </h2>

      <div
        style={{
          background: 'linear-gradient(90deg, #e6f2ff 0%, #fcf6ff 100%)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          borderRadius: 14,
          padding: '25px 30px',
          marginBottom: 32,
        }}
      >
        {isBattingFirst ? (
          <>
            <p style={{ fontSize: 18, margin: '0 0 1.2em 0', color: '#21255a' }}>
              If <b>{team}</b> scores{' '}
              <span style={{ color: '#0165ae' }}>{performanceRange.runs}</span> runs in{' '}
              <b>{overs}</b> overs,
              <br />
              <b>{team}</b> needs to restrict <b>{opponent}</b> between
              <span style={{ color: '#d41459', margin: '0 0.3em' }}>
                {calculationResult.minRestrictRuns.toFixed(2)}
              </span>
              and
              <span style={{ color: '#31a354', margin: '0 0.3em' }}>
                {calculationResult.maxRestrictRuns.toFixed(2)}
              </span>{' '}
              runs in <b>{overs}</b> overs.
            </p>
            <p style={{ fontSize: 16, color: '#232e55', marginBottom: 0 }}>
              Revised NRR of <b>{team}</b> will be between
              <span style={{ color: '#0165ae', margin: '0 0.25em' }}>
                {calculationResult.revisedNRRMin.toFixed(3)}
              </span>
              and
              <span style={{ color: '#d41459', margin: '0 0.25em' }}>
                {calculationResult.revisedNRRMax.toFixed(3)}
              </span>
              .
            </p>
          </>
        ) : (
          <>
            <p style={{ fontSize: 18, margin: '0 0 1.2em 0', color: '#21255a' }}>
              <b>{team}</b> needs to chase{' '}
              <span style={{ color: '#0165ae' }}>{performanceRange.runs}</span> runs
              <br />
              between{' '}
              <span style={{ color: '#d41459', margin: '0 0.3em' }}>
                {calculationResult.minOvers.toFixed(2)}
              </span>
              and{' '}
              <span style={{ color: '#31a354', margin: '0 0.3em' }}>
                {calculationResult.maxOvers.toFixed(2)}
              </span>{' '}
              overs.
            </p>
            <p style={{ fontSize: 16, color: '#232e55', marginBottom: 0 }}>
              Revised NRR for <b>{team}</b> will be between
              <span style={{ color: '#0165ae', margin: '0 0.25em' }}>
                {calculationResult.revisedNRRMin.toFixed(3)}
              </span>
              and
              <span style={{ color: '#d41459', margin: '0 0.25em' }}>
                {calculationResult.revisedNRRMax.toFixed(3)}
              </span>
              .
            </p>
          </>
        )}
      </div>

      <h3
        style={{
          fontSize: 19,
          letterSpacing: '0.035em',
          color: '#142850',
          marginBottom: 15,
          marginTop: 10,
        }}
      >
        Points Table
      </h3>
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'white',
            borderRadius: 8,
            boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
          }}
        >
          <thead>
            <tr style={{ background: '#e6f2ff', borderRadius: 8 }}>
              <th
                style={{
                  padding: '10px 12px',
                  textAlign: 'left',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  color: '#012d7a',
                  borderBottom: '2px solid #b2becd',
                }}
              >
                Team
              </th>
              <th
                style={{
                  padding: '10px',
                  textAlign: 'center',
                  fontWeight: 600,
                  color: '#012d7a',
                  borderBottom: '2px solid #b2becd',
                }}
              >
                Matches
              </th>
              <th
                style={{
                  padding: '10px',
                  textAlign: 'center',
                  fontWeight: 600,
                  color: '#012d7a',
                  borderBottom: '2px solid #b2becd',
                }}
              >
                Wins
              </th>
              <th
                style={{
                  padding: '10px',
                  textAlign: 'center',
                  fontWeight: 600,
                  color: '#012d7a',
                  borderBottom: '2px solid #b2becd',
                }}
              >
                Losses
              </th>
              <th
                style={{
                  padding: '10px',
                  textAlign: 'center',
                  fontWeight: 600,
                  color: '#012d7a',
                  borderBottom: '2px solid #b2becd',
                }}
              >
                NRR
              </th>
              <th
                style={{
                  padding: '10px',
                  textAlign: 'center',
                  fontWeight: 600,
                  color: '#012d7a',
                  borderBottom: '2px solid #b2becd',
                }}
              >
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {pointsTable.map((teamData) => (
              <tr
                key={teamData.team}
                style={{ background: '#fbfcfd', borderBottom: '1px solid #e7e7e7' }}
              >
                <td
                  style={{
                    padding: '9px 12px',
                    textAlign: 'left',
                    color: '#24305e',
                    fontWeight: 500,
                  }}
                >
                  {teamData.team}
                </td>
                <td style={{ padding: '8px', textAlign: 'center', color: '#24305e' }}>
                  {teamData.matches}
                </td>
                <td
                  style={{ padding: '8px', textAlign: 'center', color: '#018121', fontWeight: 500 }}
                >
                  {teamData.wins}
                </td>
                <td
                  style={{ padding: '8px', textAlign: 'center', color: '#b90031', fontWeight: 500 }}
                >
                  {teamData.losses}
                </td>
                <td style={{ padding: '8px', textAlign: 'center', color: '#0165ae' }}>
                  {Number(teamData.nrr).toFixed(3)}
                </td>
                <td
                  style={{ padding: '8px', textAlign: 'center', color: '#31a354', fontWeight: 600 }}
                >
                  {teamData.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: 35,
          width: '100%',
          padding: '13px 0',
          background: 'linear-gradient(90deg, #0165ae 0%, #d41459 80%)',
          color: '#fff',
          border: 'none',
          borderRadius: 9,
          fontWeight: 600,
          fontSize: 18,
          letterSpacing: '0.05em',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        Go Back
      </button>
    </div>
  );
}

export default ResultPage;
