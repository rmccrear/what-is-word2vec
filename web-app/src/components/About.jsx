const About = () => {
  return (
    <div className="about-display">
      <h2>About Word2Vec Similarity</h2>
      <p>
        Word2Vec is a technique that represents words as vectors in a high-dimensional space. 
        Words that appear in similar contexts are positioned close to each other in this space.
      </p>
      <p>
        <strong>Cosine Similarity</strong> measures how similar two word vectors are by calculating 
        the cosine of the angle between them. A value of 1 means the vectors point in the same direction 
        (very similar), while 0 means they are perpendicular (unrelated).
      </p>
      <p>
        The calculation involves:
      </p>
      <ul>
        <li><strong>Dot Product:</strong> Multiplying corresponding vector components and summing them</li>
        <li><strong>Vector Magnitude:</strong> The length of each vector</li>
        <li><strong>Normalization:</strong> Dividing the dot product by the product of the magnitudes</li>
      </ul>
      <p className="cta">
        👆 <strong>Click on any word in the table or chart above</strong> to see the detailed calculation 
        of how cosine similarity is computed!
      </p>
    </div>
  )
}

export default About

