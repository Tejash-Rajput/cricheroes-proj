import React, { useState } from 'react';
import * as Yup from 'yup';
import { useCalculatePerformanceMutation, useGetTeamsQuery } from './../api/cricApi';
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const { data: teams, isLoading: teamsLoading } = useGetTeamsQuery();
  const [team, setTeam] = useState('');
  const [opponent, setOpponent] = useState('');
  const [overs, setOvers] = useState('');
  const [position, setPosition] = useState('');
  const [toss, setToss] = useState('');
  const [runs, setRuns] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const [calculatePerformance, { isLoading, error: apiError }] = useCalculatePerformanceMutation();
  const positions = [1, 2, 3, 4, 5];
  // Clear a specific field error
  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev || !prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setError('');
  };

  const handleTeamChange = (e) => {
    setTeam(e.target.value);
    clearFieldError('team');
  };

  const handleOpponentChange = (e) => {
    setOpponent(e.target.value);
    clearFieldError('opponent');
  };

  const handleOversChange = (e) => {
    setOvers(e.target.value);
    clearFieldError('overs');
  };

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
    clearFieldError('desiredPosition');
  };

  const handleTossChange = (val) => {
    setToss(val);
    clearFieldError('toss');
  };

  const handleRunsChange = (e) => {
    setRuns(e.target.value);
    clearFieldError('runs');
  };
  const handleSubmit = async () => {
    setError('');
    setFieldErrors({});

    const schema = Yup.object({
      team: Yup.string().required('Team is required'),
      opponent: Yup.string()
        .required('Opponent is required')
        .test('not-same', 'Team and opponent cannot be the same', function (val) {
          return val !== this.parent.team;
        }),
      overs: Yup.string()
        .oneOf(['10', '20'], 'Overs must be 10 or 20')
        .required('Overs is required'),
      desiredPosition: Yup.number()
        .integer()
        .min(1, 'Position must be at least 1')
        .required('Desired position is required'),
      toss: Yup.string()
        .oneOf(['bat', 'bowl'], 'Toss must be bat or bowl')
        .required('Toss is required'),
      runs: Yup.number()
        .typeError('Runs must be a number')
        .integer('Runs must be an integer')
        .min(0, 'Runs cannot be negative')
        .required('Runs is required'),
    });

    const values = {
      team,
      opponent,
      overs,
      desiredPosition: Number(position),
      toss,
      runs: runs === '' ? '' : Number(runs),
    };

    try {
      await schema.validate(values, { abortEarly: false });
      setFieldErrors({});
    } catch (validationError) {
      const errs = {};
      if (validationError && validationError.inner && validationError.inner.length) {
        validationError.inner.forEach((e) => {
          if (!errs[e.path]) errs[e.path] = e.message;
        });
      } else if (validationError && validationError.message) {
        errs.general = validationError.message;
      }
      setFieldErrors(errs);
      return;
    }

    try {
      const result = await calculatePerformance({
        team,
        opponent,
        overs,
        desiredPosition: Number(position),
        toss,
        runs: Number(runs),
      }).unwrap();
      sessionStorage.setItem('cricData', JSON.stringify(result));
      navigate('/result');
    } catch (err) {
      setError('API error. Check your input and try again.');
      console.log('API Error:', err);
    }
  };

  if (teamsLoading)
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: 20 }}>Loading teams...</div>
    );

  return (
    <div
      style={{
        maxWidth: 420,
        margin: '3rem auto',
        fontFamily: 'Montserrat, Arial, sans-serif',
        padding: '36px 36px 28px',
        borderRadius: 18,
        background: '#f9f9fd',
        boxShadow: '0 6px 32px rgba(14,58,134,0.08)',
        border: '1px solid #e0e3ef',
        minHeight: 520,
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontWeight: 700,
          color: '#142850',
          letterSpacing: '0.04em',
          marginBottom: 26,
        }}
      >
        IPL Points Table Calculator
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ color: '#022f5e', fontWeight: 600 }}>
          Your Team
          <select value={team} onChange={handleTeamChange} style={selectStyle}>
            <option value="">Select Team</option>
            {teams?.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {fieldErrors.team && (
            <div style={{ color: '#de2331', fontWeight: 600, marginTop: 6 }}>
              {fieldErrors.team}
            </div>
          )}
        </label>

        <label style={{ color: '#022f5e', fontWeight: 600 }}>
          Opposition Team
          <select value={opponent} onChange={handleOpponentChange} style={selectStyle}>
            <option value="">Select Opponent</option>
            {teams
              ?.filter((t) => t !== team)
              .map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
          </select>
          {fieldErrors.opponent && (
            <div style={{ color: '#de2331', fontWeight: 600, marginTop: 6 }}>
              {fieldErrors.opponent}
            </div>
          )}
        </label>

        <label style={{ color: '#022f5e', fontWeight: 600 }}>
          Match Overs
          <select value={overs} onChange={handleOversChange} style={selectStyle}>
            <option value="">Select Overs</option>
            <option value="20">20</option>
            <option value="10">10</option>
          </select>
          {fieldErrors.overs && (
            <div style={{ color: '#de2331', fontWeight: 600, marginTop: 6 }}>
              {fieldErrors.overs}
            </div>
          )}
        </label>

        <label style={{ color: '#022f5e', fontWeight: 600 }}>
          Desired Position
          <select value={position} onChange={handlePositionChange} style={selectStyle}>
            <option value="">Select Position</option>
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
          {fieldErrors.desiredPosition && (
            <div style={{ color: '#de2331', fontWeight: 600, marginTop: 6 }}>
              {fieldErrors.desiredPosition}
            </div>
          )}
        </label>

        <div style={{ color: '#022f5e', fontWeight: 600, marginBottom: 0 }}>Toss Result:</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={radioLabelStyle}>
            <input
              type="radio"
              name="toss"
              checked={toss === 'bat'}
              value="bat"
              onChange={() => handleTossChange('bat')}
            />
            Batting First
          </label>
          <label style={radioLabelStyle}>
            <input
              type="radio"
              name="toss"
              checked={toss === 'bowl'}
              value="bowl"
              onChange={() => handleTossChange('bowl')}
            />
            Bowling First
          </label>
          {fieldErrors.toss && (
            <div style={{ color: '#de2331', fontWeight: 600, marginTop: 6 }}>
              {fieldErrors.toss}
            </div>
          )}
        </div>

        <label style={{ color: '#022f5e', fontWeight: 600 }}>
          {toss === 'bat' ? 'Runs Scored' : toss === 'bowl' ? 'Runs to Chase' : 'Runs'}
          <input
            type="number"
            min={0}
            value={runs}
            onChange={handleRunsChange}
            style={inputStyle}
            placeholder="Enter runs (e.g. 120)"
          />
          {fieldErrors.runs && (
            <div style={{ color: '#de2331', fontWeight: 600, marginTop: 6 }}>
              {fieldErrors.runs}
            </div>
          )}
        </label>

        {error && (
          <div style={{ color: '#de2331', fontWeight: 600, marginTop: 8, textAlign: 'center' }}>
            {error}
          </div>
        )}
        {apiError && (
          <div style={{ color: '#de2331', fontWeight: 600, marginTop: 8, textAlign: 'center' }}>
            API Error: {apiError.data?.error || apiError.error}
          </div>
        )}
        <button onClick={handleSubmit} disabled={isLoading} style={buttonStyle}>
          {isLoading ? 'Calculating...' : 'Calculate'}
        </button>
      </div>
    </div>
  );
}

const selectStyle = {
  width: '100%',
  marginTop: 7,
  borderRadius: 7,
  border: '1px solid #accbee',
  fontSize: 15,
  padding: '7px 12px',
  background: '#fcf6ff',
  fontWeight: 500,
  outline: 'none',
  color: '#012d7a',
};
const inputStyle = {
  width: '100%',
  marginTop: 7,
  borderRadius: 7,
  border: '1px solid #accbee',
  fontSize: 15,
  padding: '7px 12px',
  background: '#fcf6ff',
  fontWeight: 500,
  outline: 'none',
  color: '#012d7a',
};
const buttonStyle = {
  width: '100%',
  padding: '13px 0',
  marginTop: 4,
  fontWeight: 700,
  color: '#fff',
  background: 'linear-gradient(90deg,#0165ae 0%, #d41459 85%)',
  border: 'none',
  borderRadius: 9,
  fontSize: 18,
  letterSpacing: '0.05em',
  boxShadow: '0 2px 8px rgba(34,40,93,0.06)',
  cursor: 'pointer',
  transition: 'background 0.17s',
};
const radioLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  color: '#01356a',
  fontWeight: 500,
  fontSize: 15,
};

export default Homepage;
