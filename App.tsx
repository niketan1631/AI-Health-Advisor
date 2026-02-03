
import React, { useState, useCallback } from 'react';
import { HealthAdvice } from './types';
import { getHealthAdvice } from './services/geminiService';
import Disclaimer from './components/Disclaimer';
import LoadingSpinner from './components/LoadingSpinner';
import ResultCard from './components/ResultCard';

const App: React.FC = () => {
  const [healthProblem, setHealthProblem] = useState<string>('');
  const [advice, setAdvice] = useState<HealthAdvice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!healthProblem.trim()) {
      setError('Please describe your health problem.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAdvice(null);

    try {
      const result = await getHealthAdvice(healthProblem);
      setAdvice(result);
    } catch (err) {
      setError('Sorry, an error occurred while fetching advice. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [healthProblem]);

  const StethoscopeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m12.728 0L12 12m0 0L5.636 5.636M12 12v6.364" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m-7.072 0a5 5 0 010-7.072" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-6">
          <div className="flex justify-center items-center gap-4 mb-2">
            <StethoscopeIcon />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              AI Health Advisor
            </h1>
          </div>
          <p className="text-gray-600">Get AI-powered health suggestions instantly</p>
        </header>

        <Disclaimer />

        <main className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mt-6">
          <form onSubmit={handleSubmit}>
            <label htmlFor="health-problem" className="block text-lg font-semibold text-gray-700 mb-2">
              Describe your health problem
            </label>
            <textarea
              id="health-problem"
              value={healthProblem}
              onChange={(e) => setHealthProblem(e.target.value)}
              placeholder="e.g., I have a persistent dry cough and a slight headache..."
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center transition duration-150 ease-in-out"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Getting Advice...</span>
                </>
              ) : (
                'Get Advice'
              )}
            </button>
          </form>
        </main>
        
        <div className="mt-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          {advice && <ResultCard advice={advice} />}
        </div>
      </div>
    </div>
  );
};

export default App;
