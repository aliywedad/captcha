import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import turtleImage from './images/fish2.png'

import {
  faArrowUp,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const GamePieces = ({ score, setScore, onGameOver }) => {
  const [walls, setWalls] = useState([
    { x: 200, y: 100, width: 50, height: 10 },
    { x: 500, y: 200, width: 10, height: 50 },
    { x: 500, y: 200, width: 10, height: 50 },
  ]);

// var appleIcon="🐠";
const [appleIcon, SetAppleIcon] = useState("🐠")

const changefishFoods = (ctx) => {
  const fishFoods = ["🐠", "🐡", "🦐", "🪼", "🦞", "🐟", "🦀"];
  
// Pick a random emoji from the array
const randomEmoji = fishFoods[Math.floor(Math.random() * fishFoods.length)];
SetAppleIcon(randomEmoji)

}

  const drawWalls = (ctx) => {
    walls.forEach((wall) => {
      ctx.beginPath();
      ctx.rect(wall.x, wall.y, wall.width, wall.height);
      ctx.fillStyle = "#808080"; // Gray color for the walls
      ctx.fill();
      ctx.closePath();
    });
  };
  const canvasRef = useRef();
  const fish_SPEED = 10;
  const [apple, setApple] = useState({ x: 180, y: 100 });
  const [fish, setfish] = useState([
    { x: 100, y: 50 },

  ]);
  const [direction, setDirection] = useState(null);
  const drawImage = (ctx, x, y, width, height, imageSrc) => {
    const img = new Image();
    img.src = imageSrc; // URL or base64 data of the image
    img.onload = () => {
      ctx.drawImage(img, x, y, width, height);
    };
  };
const drawEmoji = (ctx, x, y) => {
  ctx.font = "30px Arial";
  ctx.fillText(appleIcon, x, y); // Fish food emoji
};

  const fishImage = useRef(new Image());
  useEffect(() => {
    fishImage.current.src = turtleImage;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Load and draw the fish image
    const drawfish = (ctx) => {
      const firstSegment = fish[0]; // Get the first segment's position
      const width = 40;  // Desired width of the turtle
      const height = 40; // Desired height of the turtle
      
      // Draw the turtle image with the adjusted size
      ctx.drawImage(fishImage.current, firstSegment.x, firstSegment.y, width, height);
    };
 

    const drawApple = (randomEmoji) => {

      
      // drawImage(ctx, apple.x, apple.y, 14, 14, "https://tse4.mm.bing.net/th?id=OIP.l6NhhcJmD9rabtmt-z7KegHaFR&pid=Api&P=0&h=180");
      drawEmoji(ctx, apple.x, apple.y + 14,randomEmoji); // Adjust y to align the emoji correctly

    };
 


    const movefish = () => {
      if (direction) {
        setfish((prevfish) => {
          const newfish = [...prevfish];
          const fishHead = { ...newfish[0] };

          for (let i = newfish.length - 1; i > 0; i--) {
            newfish[i] = { ...newfish[i - 1] };
          }

          switch (direction) {
            case "right":
              fishHead.x += fish_SPEED;
              break;
            case "left":
              fishHead.x -= fish_SPEED;
              break;
            case "up":
              fishHead.y -= fish_SPEED;
              break;
            case "down":
              fishHead.y += fish_SPEED;
              break;
            default:
              break;
          }

          newfish[0] = fishHead;

          handleAppleCollision(newfish);
          handleWallCollision(fishHead);
          handleBodyCollision(newfish);

          return newfish;
        });
      }
    };

    const handleWallCollision = (fishHead) => {
      // Check if the fish hits the game boundaries
      if (
        fishHead.x >= canvasRef.current.width ||
        fishHead.x < 0 ||
        fishHead.y >= canvasRef.current.height ||
        fishHead.y < 0
      ) {
        onGameOver("wall");
      }
    
      // Check if the fish collides with any internal walls
      if (
        walls.some(
          (wall) =>
            fishHead.x < wall.x + wall.width &&
            fishHead.x + 14 > wall.x &&
            fishHead.y < wall.y + wall.height &&
            fishHead.y + 14 > wall.y
        )
      ) {
        onGameOver("obstacle");
      }
    };



    const handleBodyCollision = (newfish) => {
      const [head, ...body] = newfish;
      if (body.some((segment) => segment.x === head.x && segment.y === head.y)) {
        onGameOver("self");
      }
    };
    const handleAppleCollision = (newfish) => {
      const fishHead = newfish[0];
      const appleRadius = 7; // Apple radius (you can adjust if needed)
      const fishSize = 2;  // Size of the fish's body segment (adjust to match your drawing size)
      
      // Set the threshold distance for the collision to 5 pixels
      const collisionThreshold = 50; // New threshold distance (in pixels)
    
      // Adjust for grid or tile-based movement if you're using a grid
      const appleX = apple.x + appleRadius; // Apple position adjusted with its radius
      const appleY = apple.y + appleRadius; // Apple position adjusted with its radius
      
      // Calculate the distance between the fish head and the apple
      const distance = Math.sqrt(
        Math.pow(fishHead.x - appleX, 2) + Math.pow(fishHead.y - appleY, 2)
      );
      
      // If the distance is less than the collision threshold (5px), the turtle eats the apple
      if (distance < collisionThreshold + fishSize) {
        setScore((prevScore) => prevScore + 1);  // Increase the score
        changefishFoods()
        setApple({
          x: Math.floor((Math.random() * canvasRef.current.width) / fish_SPEED) * fish_SPEED,
          y: Math.floor((Math.random() * canvasRef.current.height) / fish_SPEED) * fish_SPEED,
        });
        
        // Add a new segment to the fish to make it grow
        // newfish.push({ ...newfish[newfish.length - 1] });  // Add a new segment (same as the last one)
      }
    };
    
    
    
 
    const handleKeyPress = (e) => {
  switch (e.key) {
    case "ArrowRight":
      if (direction !== "left") setDirection("right");  // Prevent going left
      break;
    case "ArrowLeft":
      if (direction !== "right") setDirection("left"); // Prevent going right
      break;
    case "ArrowUp":
      if (direction !== "down") setDirection("up");    // Prevent going down
      break;
    case "ArrowDown":
      if (direction !== "up") setDirection("down");    // Prevent going up
      break;
    default:
      break;
  }
};


    window.addEventListener("keydown", handleKeyPress);

    const interval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawfish(ctx, '/images/fish.gif'); // Pass the image path directly

      drawApple();
      movefish();
          drawWalls(ctx);

    }, 100);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [fish, direction]);

  // Adjust canvas size based on device
  const generateApplePosition = () => {
    const canvas = canvasRef.current;
    let newApple;
    let isValidPosition;
  
    do {
      newApple = {
        x: Math.floor((Math.random() * canvas.width) / fish_SPEED) * fish_SPEED,
        y: Math.floor((Math.random() * canvas.height) / fish_SPEED) * fish_SPEED,
      };
  
      // Check if the new apple overlaps with any wall
      isValidPosition = !walls.some(
        (wall) =>
          newApple.x < wall.x + wall.width &&
          newApple.x + 14 > wall.x &&
          newApple.y < wall.y + wall.height &&
          newApple.y + 14 > wall.y
      );
    } while (!isValidPosition);
  
    return newApple;
  };
  const generateNewWall = () => {
    const canvas = canvasRef.current;
    let newWall;
    let isValidPosition;
  
    do {
      newWall = {
        x: Math.floor(Math.random() * canvas.width),
        y: Math.floor(Math.random() * canvas.height),
        width: 200,
        height: 10,
      };
  
      // Check if the new wall overlaps with the apple
      isValidPosition =
        !(
          newWall.x < apple.x + 14 &&
          newWall.x + newWall.width > apple.x &&
          newWall.y < apple.y + 14 &&
          newWall.y + newWall.height > apple.y
        ) &&
        // Check if the new wall overlaps with existing walls
        !walls.some(
          (wall) =>
            newWall.x < wall.x + wall.width &&
            newWall.x + newWall.width > wall.x &&
            newWall.y < wall.y + wall.height &&
            newWall.y + newWall.height > wall.y
        );
    } while (!isValidPosition);
  
    return newWall;
  };
  

  useEffect(() => {
    if (score > 0 && score % 2 === 0) {
      setWalls((prevWalls) => [...prevWalls, generateNewWall()]);
    }
  }, [score]);
  
 
  useEffect(() => {
    const canvas = canvasRef.current;
    const handleResize = () => {
      canvas.width = window.innerWidth <= 768 ? window.innerWidth * 0.95 : 750;
      canvas.height = 420;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="game-container  ">
      <canvas className="gameCanvas" ref={canvasRef} />
      <div className="controls">
  <center>
    <FontAwesomeIcon
      icon={faArrowUp}
      size="5x"
      className="arrow-icon"
      onClick={() => setDirection((prev) => (prev !== "down" ? "up" : prev))}
    />
  </center>
  <div className="flex justify-center">
    <FontAwesomeIcon
      icon={faArrowLeft}
      size="5x"
      className="arrow-icon pe-4"
      onClick={() => setDirection((prev) => (prev !== "right" ? "left" : prev))}
    />
    <FontAwesomeIcon
      icon={faArrowRight}
      size="5x"
      className="arrow-icon ps-4"
      onClick={() => setDirection((prev) => (prev !== "left" ? "right" : prev))}
    />
  </div>
  <center>
    <FontAwesomeIcon
      icon={faArrowDown}
      size="5x"
      className="arrow-icon"
      onClick={() => setDirection((prev) => (prev !== "up" ? "down" : prev))}
    />
  </center>
</div>
    </div>
  );
};

export default GamePieces;
