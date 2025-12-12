import { useState, useEffect } from 'react';
import { Stethoscope, Syringe, Bug, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function ProfileHeader({ profile, onEdit }) {
  const [healthStats, setHealthStats] = useState({
    vaccinations: [],
    treatments: [],
    weightData: [],
    totalVaccinations: 0,
    totalTreatments: 0,
    totalVermifuges: 0,
    totalAntiPuces: 0,
    totalPesees: 0,
    nextVaccination: null,
    nextTreatment: null
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      loadHealthData();
    }
  }, [profile?.id]);

  const loadHealthData = async () => {
    try {
      setLoading(true);

      // Charger les vaccinations
      const { data: vaccinations, error: vaccinationsError } = await supabase
        .from('vaccinations')
        .select('*')
        .eq('dog_id', profile.id)
        .order('vaccination_date', { ascending: false });

      if (vaccinationsError) {
        console.error('Error loading vaccinations:', vaccinationsError);
      }

      // Charger les traitements
      const { data: treatments, error: treatmentsError } = await supabase
        .from('treatments')
        .select('*')
        .eq('dog_id', profile.id)
        .order('treatment_date', { ascending: false });

      if (treatmentsError) {
        console.error('Error loading treatments:', treatmentsError);
      }

      // Charger les pesées
      const { data: weightRecords, error: weightError } = await supabase
        .from('weight_records')
        .select('*')
        .eq('dog_id', profile.id)
        .order('measurement_date', { ascending: true });

      if (weightError) {
        console.error('Error loading weight records:', weightError);
      }

      // Filtrer les traitements par type
      const vermifuges = treatments?.filter(t => 
        t.treatment_type === 'worm' || t.treatment_type === 'vermifuge'
      ) || [];

      const antiPuces = treatments?.filter(t => 
        t.treatment_type === 'flea' || t.treatment_type === 'tick'
      ) || [];

      const allTreatments = [...vermifuges, ...antiPuces];

      // Trouver les prochaines dates
      const today = new Date();
      const nextVaccination = vaccinations?.find(v => {
        if (!v.next_due_date) return false;
        return new Date(v.next_due_date) > today;
      });

      const nextTreatment = treatments?.find(t => {
        if (!t.next_due_date) return false;
        return new Date(t.next_due_date) > today;
      });

      // Calculer les statistiques
      const stats = {
        vaccinations: vaccinations || [],
        treatments: treatments || [],
        weightData: weightRecords || [],
        totalVaccinations: vaccinations?.length || 0,
        totalTreatments: allTreatments.length,
        totalVermifuges: vermifuges.length,
        totalAntiPuces: antiPuces.length,
        totalPesees: weightRecords?.length || 0,
        nextVaccination: nextVaccination,
        nextTreatment: nextTreatment
      };

      setHealthStats(stats);

    } catch (error) {
      console.error('Error in loadHealthData:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculer l'âge du chien
  const calculateAge = (birthday) => {
    if (!birthday) return 'N/A';
    const today = new Date();
    const birthDate = new Date(birthday);
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years === 0) {
      return `${months} mois`;
    } else if (months === 0) {
      return `${years} an${years > 1 ? 's' : ''}`;
    } else {
      return `${years} an${years > 1 ? 's' : ''} et ${months} mois`;
    }
  };

  // Formater une date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Card 1 : Informations */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
          <Stethoscope className="w-5 h-5 text-blue-500" />
          Informations
        </h3>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Race</p>
            <p className="font-semibold text-gray-900 flex items-center gap-2">
              🐕 {profile.breed || 'Non spécifiée'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Sexe</p>
            <p className="font-semibold text-gray-900 flex items-center gap-2">
              {profile.gender === 'male' ? '♂' : '♀'} {profile.gender === 'male' ? 'Mâle' : 'Femelle'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Âge</p>
            <p className="font-semibold text-gray-900 flex items-center gap-2">
              🎂 {profile.age || calculateAge(profile.birthday)}
            </p>
          </div>

          {profile.weight && (
            <div>
              <p className="text-sm text-gray-500">Poids actuel</p>
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                ⚖️ {profile.weight}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500">Statut</p>
            <p className="font-semibold text-gray-900 flex items-center gap-2">
              {profile.sterilized === 'Stérilisé' ? '💚 Stérilisé' : '🔵 Non stérilisé'}
            </p>
          </div>
        </div>
      </div>

      {/* Card 2 : Résumé santé */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
          <Syringe className="w-5 h-5 text-green-500" />
          Résumé santé
        </h3>

        <div className="space-y-3">
          {/* Vaccinations */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Syringe className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Vaccinations</p>
                <p className="font-bold text-gray-900">
                  {healthStats.totalVaccinations} enregistré{healthStats.totalVaccinations > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Vermifuge */}
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Bug className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Vermifuge</p>
                <p className="font-bold text-gray-900">
                  {healthStats.totalVermifuges} traitement{healthStats.totalVermifuges > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Anti-puces */}
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Bug className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Anti-puces</p>
                <p className="font-bold text-gray-900">
                  {healthStats.totalAntiPuces} traitement{healthStats.totalAntiPuces > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Pesées */}
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Pesées</p>
                <p className="font-bold text-gray-900">
                  {healthStats.totalPesees} enregistrée{healthStats.totalPesees > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3 : À venir */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-purple-500" />
          À venir
        </h3>

        <div className="space-y-3">
          {healthStats.nextVaccination ? (
            <div className="p-3 bg-blue-50 rounded-xl">
              <div className="flex items-start gap-3">
                <Syringe className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {healthStats.nextVaccination.vaccine_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    📅 {formatDate(healthStats.nextVaccination.next_due_date)}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {healthStats.nextTreatment ? (
            <div className="p-3 bg-green-50 rounded-xl">
              <div className="flex items-start gap-3">
                <Bug className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {healthStats.nextTreatment.product_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    📅 {formatDate(healthStats.nextTreatment.next_due_date)}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {!healthStats.nextVaccination && !healthStats.nextTreatment && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">
                Aucun rendez-vous à venir
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Card 4 : Courbe de poids */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          Courbe de poids
        </h3>

        {healthStats.weightData.length > 0 ? (
          <div className="space-y-4">
            {/* Poids actuel */}
            <div className="p-4 bg-orange-50 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-1">Dernier poids</p>
              <p className="text-3xl font-bold text-gray-900">
                {healthStats.weightData[healthStats.weightData.length - 1]?.weight} kg
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(healthStats.weightData[healthStats.weightData.length - 1]?.measurement_date)}
              </p>
            </div>

            {/* Historique simple */}
            {healthStats.weightData.length > 1 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Historique</p>
                <div className="space-y-1">
                  {healthStats.weightData.slice(-3).reverse().map((record, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{formatDate(record.measurement_date)}</span>
                      <span className="font-semibold text-gray-900">{record.weight} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              Aucune pesée enregistrée
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
