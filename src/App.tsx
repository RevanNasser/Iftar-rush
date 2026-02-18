import React, { useState, useEffect, useRef, useCallback } from 'react';
import './styles.css';
import foodList from './foodList.json';

interface FoodItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  svg: string;
  name: string;
}

interface CollectedFood {
  svg: string;
  name: string;
  count: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
}

const GAME_DURATION = 30;
const SPAWN_RATE = 800;

const foodColors = ['#F9E476', '#FFE066', '#FFD700', '#FFF8DC', '#F5DEB3', '#FFFACD'];

function getFoodName(svgPath: string): string {
  const filename = svgPath.replace('/food/', '').replace('.svg', '');
  return filename.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function RamadanBackground() {
  return (
    <div className="ramadan-bg">
      <div className="stars"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="moon">
        <svg viewBox="0 0 444 468" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_ii_2_39)">
            <path fillRule="evenodd" clipRule="evenodd" d="M439.321 367.638C442.879 362.905 437.957 356.643 432.289 358.354C410.057 365.067 386.478 368.675 362.056 368.675C228.063 368.675 119.441 260.053 119.441 126.06C119.441 84.8159 129.732 45.9755 147.888 11.9668C150.676 6.7434 145.498 0.696718 140.163 3.26502C58.8029 42.4316 2.65179 125.655 2.65179 221.994C2.65179 355.987 111.274 464.609 245.267 464.609C324.608 464.609 395.054 426.524 439.321 367.638Z" fill="url(#paint0_linear_2_39)"/>
          </g>
          <defs>
            <filter id="filter0_ii_2_39" x="0" y="-30.6235" width="443.177" height="532.183" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="-30.6235"/>
              <feGaussianBlur stdDeviation="48.9975"/>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0.991667 0 0 0 0 0.599132 0 0 0 0 0.622684 0 0 0 1 0"/>
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow_2_39"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="34.2983"/>
              <feGaussianBlur stdDeviation="21.4364"/>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0"/>
              <feBlend mode="normal" in2="effect1_innerShadow_2_39" result="effect2_innerShadow_2_39"/>
            </filter>
            <linearGradient id="paint0_linear_2_39" x1="188.263" y1="149.437" x2="161.846" y2="440.019" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F9E79F"/>
              <stop offset="1" stopColor="#F4D03F"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="scattered-stars">
        <svg className="star star-1" viewBox="0 0 240 265" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_i_2_45)">
            <path d="M134.615 104.988C137.925 100.708 144.622 101.59 146.712 106.581L160.708 140.008C161.473 141.836 162.972 143.258 164.838 143.927L198.952 156.154C204.045 157.979 205.276 164.621 201.175 168.15L173.709 191.791C172.207 193.084 171.317 194.949 171.258 196.93L170.171 233.153C170.009 238.561 164.073 241.784 159.449 238.975L128.478 220.158C126.784 219.129 124.736 218.859 122.833 219.415L88.0475 229.575C82.8537 231.092 77.954 226.443 79.197 221.176L87.5221 185.907C87.9774 183.978 87.6009 181.946 86.4844 180.308L66.0723 150.365C63.0246 145.894 65.9325 139.797 71.325 139.352L107.441 136.371C109.416 136.208 111.232 135.222 112.445 133.654L134.615 104.988Z" fill="url(#paint0_linear_2_45)"/>
          </g>
          <defs>
            <filter id="filter0_i_2_45" x="63.0666" y="100.478" width="142.334" height="180.839" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="39.5356"/>
              <feGaussianBlur stdDeviation="24.7097"/>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"/>
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow_2_45"/>
            </filter>
            <linearGradient id="paint0_linear_2_45" x1="121.658" y1="145.692" x2="100.133" y2="243.127" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F9E79F"/>
              <stop offset="1" stopColor="#F4D03F"/>
            </linearGradient>
          </defs>
        </svg>
        <svg className="star star-2" viewBox="0 0 240 265" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter1_i_2_45)">
            <path d="M51.618 14.6286C54.3748 11.2913 59.7068 12.1683 61.2495 16.2127L66.9957 31.2773C67.5609 32.7588 68.7228 33.9346 70.1975 34.5172L85.1929 40.4417C89.2188 42.0323 90.0324 47.3743 86.6627 50.0913L74.1111 60.2116C72.8767 61.2068 72.1175 62.6752 72.0191 64.2578L71.0184 80.35C70.7498 84.6704 65.9206 87.095 62.2952 84.7298L48.7917 75.9198C47.4637 75.0534 45.8326 74.7851 44.297 75.1806L28.6832 79.2016C24.4913 80.2812 20.693 76.4376 21.8222 72.2588L26.0282 56.6938C26.4418 55.163 26.1929 53.5288 25.3423 52.1906L16.6931 38.5836C14.371 34.9304 16.8527 30.1303 21.1759 29.9129L37.2789 29.1032C38.8626 29.0235 40.3398 28.2818 41.3497 27.0593L51.618 14.6286Z" fill="url(#paint1_linear_2_45)"/>
          </g>
          <defs>
            <filter id="filter1_i_2_45" x="14.0336" y="10.8078" width="76.5015" height="116.153" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="39.5356"/>
              <feGaussianBlur stdDeviation="24.7097"/>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"/>
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow_2_45"/>
            </filter>
            <linearGradient id="paint1_linear_2_45" x1="45.7062" y1="34.439" x2="32.1529" y2="87.6205" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F9E79F"/>
              <stop offset="1" stopColor="#F4D03F"/>
            </linearGradient>
          </defs>
        </svg>
        <svg className="star star-3" viewBox="0 0 240 265" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter2_i_2_45)">
            <path d="M204.689 65.1777C205.75 62.1097 209.727 61.3273 211.872 63.7645L216.035 68.4953C216.821 69.3881 217.945 69.9095 219.134 69.9321L225.435 70.0517C228.681 70.1133 230.654 73.6534 228.999 76.4464L225.786 81.8679C225.18 82.891 225.032 84.1219 225.378 85.2597L227.211 91.2891C228.155 94.3952 225.398 97.3655 222.231 96.6545L216.082 95.2744C214.921 95.0139 213.705 95.2532 212.73 95.9339L207.562 99.5407C204.9 101.399 201.223 99.6943 200.92 96.462L200.332 90.1874C200.221 89.0033 199.618 87.9204 198.669 87.2032L193.642 83.4029C191.052 81.4451 191.537 77.4215 194.518 76.1348L200.304 73.6371C201.395 73.1657 202.239 72.2571 202.628 71.1332L204.689 65.1777Z" fill="url(#paint2_linear_2_45)"/>
          </g>
          <defs>
            <filter id="filter2_i_2_45" x="190.192" y="60.557" width="41.1756" height="81.057" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="39.5356"/>
              <feGaussianBlur stdDeviation="24.7097"/>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"/>
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow_2_45"/>
            </filter>
            <linearGradient id="paint2_linear_2_45" x1="206.095" y1="74.5544" x2="209.314" y2="104.316" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F9E79F"/>
              <stop offset="1" stopColor="#F4D03F"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function App() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'ended'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [basketX, setBasketX] = useState(50);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [collectedFood, setCollectedFood] = useState<CollectedFood[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iftarHighScore');
      if (saved) setHighScore(parseInt(saved));
    }
  }, []);

  const spawnParticle = (x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        color,
        life: 1,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFoodItems([]);
    setCollectedFood([]);
    setParticles([]);
    setShowResult(false);
    lastSpawnRef.current = 0;
  };

  const endGame = useCallback(() => {
    setGameState('ended');
    setShowResult(true);
    if (score > highScore && typeof window !== 'undefined') {
      setHighScore(score);
      localStorage.setItem('iftarHighScore', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        setBasketX(Math.max(5, Math.min(95, x)));
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (gameAreaRef.current && e.touches[0]) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
        setBasketX(Math.max(5, Math.min(95, x)));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, endGame]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = (timestamp: number) => {
      if (timestamp - lastSpawnRef.current > SPAWN_RATE) {
        const randomSvg = foodList[Math.floor(Math.random() * foodList.length)];
        const newFood: FoodItem = {
          id: Date.now() + Math.random(),
          x: Math.random() * 90 + 5,
          y: -5,
          speed: Math.random() * 0.5 + 0.3,
          svg: randomSvg,
          name: getFoodName(randomSvg),
        };
        setFoodItems(prev => [...prev, newFood]);
        lastSpawnRef.current = timestamp;
      }

      setFoodItems(prev => {
        const updated = prev.map(food => ({
          ...food,
          y: food.y + food.speed,
        }));

        const remaining: FoodItem[] = [];
        let scoreIncrease = 0;
        const caught: FoodItem[] = [];

        updated.forEach(food => {
          const basketLeft = basketX - 5;
          const basketRight = basketX + 5;
          const basketTop = 85;
          const basketBottom = 95;

          if (
            food.x >= basketLeft &&
            food.x <= basketRight &&
            food.y >= basketTop &&
            food.y <= basketBottom
          ) {
            scoreIncrease++;
            caught.push(food);
            const randomColor = foodColors[Math.floor(Math.random() * foodColors.length)];
            spawnParticle(food.x, food.y, randomColor);
          } else if (food.y < 105) {
            remaining.push(food);
          }
        });

        if (scoreIncrease > 0) {
          setScore(s => s + scoreIncrease);
          setCollectedFood(prev => {
            const updated = [...prev];
            caught.forEach(food => {
              const existing = updated.find(f => f.svg === food.svg);
              if (existing) {
                existing.count++;
              } else {
                updated.push({ svg: food.svg, name: food.name, count: 1 });
              }
            });
            return updated.sort((a, b) => b.count - a.count);
          });
        }

        return remaining;
      });

      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2,
            life: p.life - 0.02,
          }))
          .filter(p => p.life > 0)
      );

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, basketX]);

  if (gameState === 'start') {
    return (
      <>
        <RamadanBackground />
        <div className="start-screen" dir="rtl">
          <div className="start-content">
            <p className="subtitle">كمّل سفرة رمضان! 🌙</p>
            <div className="start-icon">
              <img src={foodList.find(food => food.includes('Samosa.svg'))} alt="Food" className="start-food-icon" />
            </div>
            <p className="instructions">
              عندك 30 ثانية تكمل سفرة رمضان بأكبر عدد من الأكلات! 🌙
            </p>
            <button className="start-button" onClick={startGame}>
              ابدأ اللعبة
            </button>
          
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <RamadanBackground />
      <div className="game-container" dir="rtl">
        <div className="game-header">
          <div className="score-display">
            <span className="score-label">النقاط</span>
            <span className="score-value">{score}</span>
          </div>
          <div className="timer-display">
            <span className="timer-label">الوقت</span>
            <span className={`timer-value ${timeLeft <= 5 ? 'urgent' : ''}`}>
              {timeLeft}ث
            </span>
          </div>
          <div className="highscore-display">
            <span className="highscore-label">الأفضل</span>
            <span className="highscore-value">{highScore}</span>
          </div>
        </div>

        <div ref={gameAreaRef} className="game-area">
          {foodItems.map(food => (
            <div
              key={food.id}
              className="falling-food"
              style={{
                left: `${food.x}%`,
                top: `${food.y}%`,
              }}
            >
              <img src={food.svg} alt={food.name} className="food-icon" />
            </div>
          ))}

          {particles.map(particle => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                backgroundColor: particle.color,
                opacity: particle.life,
                transform: `scale(${particle.life})`,
              }}
            />
          ))}

          <div
            className="basket"
            style={{
              left: `${basketX}%`,
            }}
          >
            <img src="/basket.png" alt="Basket" className="basket-image" />
          </div>
        </div>

        {showResult && (
          <div className="modal-overlay">
            <div className="result-modal">
              <div className="modal-content">
                <h2 className="result-title">
                  {score >= highScore && score > 0 ? '🎉 رقم قياسي جديد!' : 'انتهى الوقت!'}
                </h2>
                <div className="result-stats">
                  <div className="stat">
                    <span className="stat-label">الطعام المجموع</span>
                    <span className="stat-value">{score}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">أعلى نتيجة</span>
                    <span className="stat-value">{Math.max(score, highScore)}</span>
                  </div>
                </div>

                {collectedFood.length > 0 && (
                  <div className="collected-food-section">
                    <h3 className="collected-title">مائدة إفطارك 🍽️</h3>
                    <div className="dining-table">
                      <div className="table-surface">
                        {collectedFood.map((food, foodIndex) => (
                          <React.Fragment key={foodIndex}>
                            {Array.from({ length: food.count }).map((_, countIndex) => (
                              <div
                                key={`${foodIndex}-${countIndex}`}
                                className="table-food-item"
                                style={{
                                  left: `${10 + Math.random() * 70}%`,
                                  top: `${10 + Math.random() * 70}%`,
                                  transform: `rotate(${Math.random() * 360}deg)`,
                                }}
                              >
                                <img src={food.svg} alt={food.name} className="table-food-img" />
                              </div>
                            ))}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="table-legs">
                        <div className="table-leg"></div>
                        <div className="table-leg"></div>
                        <div className="table-leg"></div>
                        <div className="table-leg"></div>
                      </div>
                    </div>
                  </div>
                )}

         
                <button className="play-again-button" onClick={startGame}>
                  العب مرة أخرى
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="footer">
Github: @RevanNasser       </div>
    </>
  );
}

export default App;
