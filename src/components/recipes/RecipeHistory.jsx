import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Clock, ChefHat, Trash2 } from 'lucide-react';

const RecipeHistory = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipes();

    // Écouter l'événement de création de recette
    const handleRecipeCreated = () => {
      loadRecipes();
    };

    window.addEventListener('recipeCreated', handleRecipeCreated);
    return () => window.removeEventListener('recipeCreated', handleRecipeCreated);
  }, []);

  const loadRecipes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('dog_recipes')
        .select(`
          *,
          dogs:dog_id (
            name,
            profile_image_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setRecipes(data || []);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId) => {
    if (!confirm('Supprimer cette recette ?')) return;

    try {
      const { error } = await supabase
        .from('dog_recipes')
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      setRecipes(recipes.filter(r => r.id !== recipeId));
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📚 Historique</h3>
        <div className="text-center py-8">
          <ChefHat size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucune recette sauvegardée</p>
          <p className="text-sm text-gray-400 mt-1">Vos recettes apparaîtront ici</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">📚 Historique des recettes</h3>
      
      <div className="space-y-3">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="p-4 border border-gray-200 rounded-2xl hover:border-primary/50 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Info */}
              <div className="flex items-start gap-3 flex-1">
                {recipe.dogs?.profile_image_url && (
                  <img
                    src={recipe.dogs.profile_image_url}
                    alt={recipe.dogs.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                )}
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">
                    {recipe.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {recipe.objective}
                    </span>
                    <span>• {recipe.dog_weight} kg</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                    <Clock size={14} />
                    <span>{formatDate(recipe.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={() => handleDelete(recipe.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Nutrition résumé */}
            <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
              <div className="text-center flex-1">
                <div className="text-sm font-bold text-primary">
                  {recipe.nutrition_info?.calories || 0}
                </div>
                <div className="text-xs text-gray-500">kcal</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-sm font-bold text-primary">
                  {recipe.nutrition_info?.protein || 0}g
                </div>
                <div className="text-xs text-gray-500">protéines</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-sm font-bold text-primary">
                  {recipe.nutrition_info?.carbs || 0}g
                </div>
                <div className="text-xs text-gray-500">glucides</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-sm font-bold text-primary">
                  {recipe.nutrition_info?.fiber || 0}g
                </div>
                <div className="text-xs text-gray-500">fibres</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeHistory;
