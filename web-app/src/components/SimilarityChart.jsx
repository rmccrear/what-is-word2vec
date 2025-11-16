import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const SimilarityChart = ({ results, onBarClick, selectedWord }) => {
  if (!results || results.length === 0) {
    return null
  }

  // Determine which word is selected (default to first if none selected)
  const activeWord = selectedWord || (results.length > 0 ? results[0].word : null)

  return (
    <div className="chart-container">
      <Bar
        data={{
          labels: results.map(r => r.word),
          datasets: [
            {
              label: 'Cosine Similarity',
              data: results.map(r => r.similarity),
              backgroundColor: results.map(r => 
                r.word === activeWord 
                  ? 'rgba(24, 144, 255, 0.8)' // Highlighted blue
                  : 'rgba(74, 85, 104, 0.6)'  // Default gray
              ),
              borderColor: results.map(r => 
                r.word === activeWord 
                  ? 'rgba(24, 144, 255, 1)'   // Highlighted blue border
                  : 'rgba(74, 85, 104, 1)'    // Default gray border
              ),
              borderWidth: results.map(r => 
                r.word === activeWord ? 2 : 1  // Thicker border for selected
              ),
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          onClick: (event, elements) => {
            if (elements.length > 0 && onBarClick) {
              const clickedIndex = elements[0].index
              const clickedWord = results[clickedIndex].word
              onBarClick(clickedWord)
            }
          },
          onHover: (event, elements) => {
            event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default'
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: 'Similarity Scores (click a bar to see calculation)',
              font: {
                size: 16,
              },
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Similarity: ${context.parsed.y.toFixed(4)}`
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Cosine Similarity',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Words',
              },
            },
          },
        }}
      />
    </div>
  )
}

export default SimilarityChart

