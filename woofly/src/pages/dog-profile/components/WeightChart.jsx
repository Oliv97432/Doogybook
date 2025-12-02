import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WeightChart = ({ data, onAddWeight }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm font-semibold text-foreground mb-1">
            {payload?.[0]?.payload?.date}
          </p>
          <p className="text-sm text-muted-foreground font-caption">
            Poids: {payload?.[0]?.value} kg
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-semibold text-foreground">
              Évolution du poids
            </h3>
            <p className="text-sm text-muted-foreground font-caption">
              Suivi sur les 6 derniers mois
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          iconName="Plus"
          iconPosition="left"
          onClick={onAddWeight}
        >
          Ajouter
        </Button>
      </div>
      <div className="w-full h-80" aria-label="Graphique d'évolution du poids">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px', fontFamily: 'Source Sans 3' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px', fontFamily: 'Source Sans 3' }}
              label={{ value: 'Poids (kg)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="var(--color-primary)" 
              strokeWidth={3}
              dot={{ fill: 'var(--color-primary)', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-background rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground font-caption mb-1">Poids actuel</p>
          <p className="text-2xl font-semibold text-foreground">
            {data?.[data?.length - 1]?.weight} kg
          </p>
        </div>
        <div className="bg-background rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground font-caption mb-1">Poids initial</p>
          <p className="text-2xl font-semibold text-foreground">
            {data?.[0]?.weight} kg
          </p>
        </div>
        <div className="bg-background rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground font-caption mb-1">Variation</p>
          <p className={`text-2xl font-semibold ${
            data?.[data?.length - 1]?.weight > data?.[0]?.weight 
              ? 'text-success' :'text-warning'
          }`}>
            {(data?.[data?.length - 1]?.weight - data?.[0]?.weight)?.toFixed(1)} kg
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeightChart;