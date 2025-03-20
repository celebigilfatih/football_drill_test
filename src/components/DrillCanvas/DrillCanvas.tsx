'use client';

import React, { useRef, useEffect, useState } from 'react';
import { CanvasProps, DrillState, Tool, Position, Player, Ball, Movement, FieldType } from './types';

export const DrillCanvas: React.FC<CanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>('select');
  const [fieldType, setFieldType] = useState<FieldType>('full');
  const [drillState, setDrillState] = useState<DrillState>({
    players: [],
    balls: [],
    movements: [],
    cones: [],
    sticks: [],
    fieldType: 'full'
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw football field background
    drawField(ctx);

    // Draw all elements
    drawPlayers(ctx);
    drawBalls(ctx);
    drawMovements(ctx);
    drawCones(ctx);
    drawSticks(ctx);
  }, [drillState, width, height, fieldType]);

  const drawField = (ctx: CanvasRenderingContext2D) => {
    // Draw green background
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, 0, width, height);

    // Field dimensions based on type
    let fieldWidth = width - 100;
    let fieldHeight = height - 100;
    let startX = 50;
    let startY = 50;

    if (fieldType === 'half') {
      fieldWidth = width - 100;
      fieldHeight = (height - 100) / 2;
      startY = (height - fieldHeight) / 2;
    } else if (fieldType === 'custom') {
      fieldWidth = (width - 100) * 0.7;
      fieldHeight = (height - 100) * 0.7;
      startX = (width - fieldWidth) / 2;
      startY = (height - fieldHeight) / 2;
    }

    // Draw field lines
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, fieldWidth, fieldHeight);

    // Draw center circle and line for full and custom field
    if (fieldType !== 'half') {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 50, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width / 2, startY);
      ctx.lineTo(width / 2, startY + fieldHeight);
      ctx.stroke();
    }

    // Draw goals
    const goalWidth = 30;
    const goalHeight = 100;

    // Left goal
    ctx.beginPath();
    ctx.moveTo(startX, startY + fieldHeight/2 - goalHeight/2);
    ctx.lineTo(startX - goalWidth, startY + fieldHeight/2 - goalHeight/2);
    ctx.lineTo(startX - goalWidth, startY + fieldHeight/2 + goalHeight/2);
    ctx.lineTo(startX, startY + fieldHeight/2 + goalHeight/2);
    ctx.stroke();

    // Right goal (only for full and custom field)
    if (fieldType !== 'half') {
      ctx.beginPath();
      ctx.moveTo(startX + fieldWidth, startY + fieldHeight/2 - goalHeight/2);
      ctx.lineTo(startX + fieldWidth + goalWidth, startY + fieldHeight/2 - goalHeight/2);
      ctx.lineTo(startX + fieldWidth + goalWidth, startY + fieldHeight/2 + goalHeight/2);
      ctx.lineTo(startX + fieldWidth, startY + fieldHeight/2 + goalHeight/2);
      ctx.stroke();
    }
  };

  const drawPlayers = (ctx: CanvasRenderingContext2D) => {
    drillState.players.forEach((player) => {
      ctx.beginPath();
      ctx.arc(player.position.x, player.position.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = player.team === 'home' ? '#2196F3' : '#F44336';
      ctx.fill();
      ctx.stroke();

      if (player.number) {
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(player.number.toString(), player.position.x, player.position.y);
      }
    });
  };

  const drawBalls = (ctx: CanvasRenderingContext2D) => {
    drillState.balls.forEach((ball) => {
      ctx.beginPath();
      ctx.arc(ball.position.x, ball.position.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.stroke();
    });
  };

  const drawCones = (ctx: CanvasRenderingContext2D) => {
    drillState.cones.forEach((cone) => {
      const height = 20;
      const baseWidth = 16;

      ctx.beginPath();
      ctx.moveTo(cone.position.x, cone.position.y - height);
      ctx.lineTo(cone.position.x - baseWidth/2, cone.position.y);
      ctx.lineTo(cone.position.x + baseWidth/2, cone.position.y);
      ctx.closePath();
      ctx.fillStyle = '#FF9800';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.stroke();
    });
  };

  const drawSticks = (ctx: CanvasRenderingContext2D) => {
    drillState.sticks.forEach((stick) => {
      const height = 30;
      
      ctx.beginPath();
      ctx.moveTo(stick.position.x, stick.position.y - height);
      ctx.lineTo(stick.position.x, stick.position.y);
      ctx.strokeStyle = '#795548';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw base
      ctx.beginPath();
      ctx.arc(stick.position.x, stick.position.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#795548';
      ctx.fill();
    });
  };

  const drawMovements = (ctx: CanvasRenderingContext2D) => {
    drillState.movements.forEach((movement) => {
      ctx.beginPath();
      ctx.moveTo(movement.start.x, movement.start.y);
      ctx.lineTo(movement.end.x, movement.end.y);
      ctx.strokeStyle = movement.type === 'player' ? '#FFC107' : '#4CAF50';
      ctx.lineWidth = 2;
      
      // Draw arrow head
      const angle = Math.atan2(movement.end.y - movement.start.y, movement.end.x - movement.start.x);
      ctx.stroke();
      
      // Arrow head
      const headLength = 15;
      ctx.beginPath();
      ctx.moveTo(movement.end.x, movement.end.y);
      ctx.lineTo(
        movement.end.x - headLength * Math.cos(angle - Math.PI / 6),
        movement.end.y - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(movement.end.x, movement.end.y);
      ctx.lineTo(
        movement.end.x - headLength * Math.cos(angle + Math.PI / 6),
        movement.end.y - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const position: Position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    // Handle different tools
    switch (selectedTool) {
      case 'player':
        addPlayer(position);
        break;
      case 'ball':
        addBall(position);
        break;
      case 'cone':
        addCone(position);
        break;
      case 'stick':
        addStick(position);
        break;
    }
  };

  const addPlayer = (position: Position) => {
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      position,
      team: 'home',
      number: drillState.players.length + 1
    };

    setDrillState(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));
  };

  const addBall = (position: Position) => {
    const newBall: Ball = {
      id: `ball-${Date.now()}`,
      position
    };

    setDrillState(prev => ({
      ...prev,
      balls: [...prev.balls, newBall]
    }));
  };

  const addCone = (position: Position) => {
    const newCone = {
      id: `cone-${Date.now()}`,
      position
    };

    setDrillState(prev => ({
      ...prev,
      cones: [...prev.cones, newCone]
    }));
  };

  const addStick = (position: Position) => {
    const newStick = {
      id: `stick-${Date.now()}`,
      position
    };

    setDrillState(prev => ({
      ...prev,
      sticks: [...prev.sticks, newStick]
    }));
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleCanvasClick}
        className="border border-gray-300 rounded-lg"
      />
      <div className="absolute top-4 left-4 flex gap-2 bg-white p-2 rounded-lg shadow-md">
        <select
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value as FieldType)}
          className="px-3 py-1 rounded bg-gray-200 mr-2"
        >
          <option value="full">Tam Saha</option>
          <option value="half">Yarı Saha</option>
          <option value="custom">Daraltılmış Alan</option>
        </select>
        <button
          onClick={() => setSelectedTool('select')}
          className={`px-3 py-1 rounded ${selectedTool === 'select' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Select
        </button>
        <button
          onClick={() => setSelectedTool('player')}
          className={`px-3 py-1 rounded ${selectedTool === 'player' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Player
        </button>
        <button
          onClick={() => setSelectedTool('ball')}
          className={`px-3 py-1 rounded ${selectedTool === 'ball' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Ball
        </button>
        <button
          onClick={() => setSelectedTool('cone')}
          className={`px-3 py-1 rounded ${selectedTool === 'cone' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Cone
        </button>
        <button
          onClick={() => setSelectedTool('stick')}
          className={`px-3 py-1 rounded ${selectedTool === 'stick' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Stick
        </button>
        <button
          onClick={() => setSelectedTool('movement')}
          className={`px-3 py-1 rounded ${selectedTool === 'movement' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Movement
        </button>
        <button
          onClick={() => setSelectedTool('delete')}
          className={`px-3 py-1 rounded ${selectedTool === 'delete' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};