#!/usr/bin/env python3
"""
Générateur de pages immobilières
=================================
Génère des pages HTML à partir de templates et de données JSON

Usage:
    python generator.py --input data/properties/mon-bien.json
    python generator.py --input data/properties/mon-bien.json --output dist/
"""

import json
import argparse
import sys
from pathlib import Path
from typing import Dict, Any


class PropertyGenerator:
    """Générateur de pages immobilières"""
    
    def __init__(self, template_path: str = 'src/templates/property.html'):
        """
        Initialise le générateur
        
        Args:
            template_path: Chemin vers le template HTML
        """
        self.template_path = Path(template_path)
        self.template_content = self._load_template()
    
    def _load_template(self) -> str:
        """Charge le template HTML"""
        try:
            with open(self.template_path, 'r', encoding='utf-8') as f:
                content = f.read()
            print(f"OK Template charge: {self.template_path}")
            return content
        except FileNotFoundError:
            print(f"ERREUR Template non trouve: {self.template_path}")
            sys.exit(1)
        except Exception as e:
            print(f"ERREUR lecture template: {e}")
            sys.exit(1)
    
    def load_config(self, config_path: str) -> Dict[str, Any]:
        """
        Charge la configuration JSON
        
        Args:
            config_path: Chemin vers le fichier JSON
            
        Returns:
            Configuration parsée
        """
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            print(f"OK Configuration chargee: {config_path}")
            return config
        except FileNotFoundError:
            print(f"ERREUR Fichier JSON non trouve: {config_path}")
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"ERREUR JSON invalide: {e}")
            sys.exit(1)
        except Exception as e:
            print(f"ERREUR lecture config: {e}")
            sys.exit(1)
    
    def validate_config(self, config: Dict[str, Any]) -> bool:
        """
        Valide la configuration
        
        Args:
            config: Configuration à valider
            
        Returns:
            True si valide
        """
        required_keys = ['property', 'media', 'agency']
        
        for key in required_keys:
            if key not in config:
                print(f"ERREUR Cle requise manquante: {key}")
                return False
        
        # Vérifications spécifiques
        if 'title' not in config['property']:
            print("ERREUR property.title manquant")
            return False
        
        if 'name' not in config['agency']:
            print("ERREUR agency.name manquant")
            return False
        
        print("OK Configuration valide")
        return True
    
    def generate_meta_description(self, config: Dict[str, Any]) -> str:
        """
        Génère une meta description SEO
        
        Args:
            config: Configuration complète
            
        Returns:
            Meta description
        """
        prop = config['property']
        
        parts = [prop.get('title', 'Bien immobilier')]
        
        if 'location' in prop:
            parts.append(f"a {prop['location']}")
        
        if 'price' in prop:
            parts.append(f"- {prop['price']}")
        
        # Ajoute features si disponibles
        if 'features' in config and config['features']:
            features_text = ', '.join([
                f"{f['value']} {f['label']}" 
                for f in config['features'][:3]
            ])
            parts.append(f"| {features_text}")
        
        return ' '.join(parts)
    
    def replace_placeholders(self, config: Dict[str, Any]) -> str:
        """
        Remplace les placeholders dans le template
        
        Args:
            config: Configuration complète
            
        Returns:
            HTML avec placeholders remplacés
        """
        html = self.template_content
        prop = config['property']
        media = config.get('media', {})
        
        # Remplacements basiques
        replacements = {
            '[[PROPERTY_TITLE]]': prop.get('title', ''),
            '[[PROPERTY_LOCATION]]': prop.get('location', ''),
            '[[PROPERTY_PRICE]]': prop.get('price', ''),
            '[[PROPERTY_DESCRIPTION]]': self.generate_meta_description(config),
            '[[PROPERTY_IMAGE]]': media.get('heroImage', ''),
        }
        
        for placeholder, value in replacements.items():
            html = html.replace(placeholder, value)
        
        # Injection de la config JSON complète
        config_json = json.dumps(config, ensure_ascii=False, indent=2)
        html = html.replace('[[PROPERTY_CONFIG_JSON]]', config_json)
        
        return html
    
    def generate(self, config_path: str, output_path: str = None) -> str:
        """
        Génère la page HTML
        
        Args:
            config_path: Chemin vers la config JSON
            output_path: Chemin de sortie (optionnel)
            
        Returns:
            Chemin du fichier généré
        """
        print("\nGENERATION DE LA PAGE...")
        print("=" * 50)
        
        # 1. Charge la config
        config = self.load_config(config_path)
        
        # 2. Valide
        if not self.validate_config(config):
            print("ERREUR Validation echouee")
            sys.exit(1)
        
        # 3. Génère le HTML
        html = self.replace_placeholders(config)
        
        # 4. Détermine le chemin de sortie
        if output_path is None:
            # Nom du fichier basé sur le JSON
            config_file = Path(config_path)
            output_name = config_file.stem + '.html'
            output_path = Path('dist') / output_name
        else:
            output_path = Path(output_path)
        
        # 5. Crée le dossier de sortie si nécessaire
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # 6. Écrit le fichier
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(html)
            print(f"OK Page generee: {output_path}")
            print("=" * 50)
            return str(output_path)
        except Exception as e:
            print(f"ERREUR ecriture fichier: {e}")
            sys.exit(1)
    
    def generate_batch(self, config_dir: str, output_dir: str = 'dist'):
        """
        Génère plusieurs pages à partir d'un dossier
        
        Args:
            config_dir: Dossier contenant les JSON
            output_dir: Dossier de sortie
        """
        config_path = Path(config_dir)
        
        if not config_path.exists():
            print(f"ERREUR Dossier non trouve: {config_dir}")
            sys.exit(1)
        
        # Trouve tous les JSON
        json_files = list(config_path.glob('*.json'))
        
        # Exclut template.json
        json_files = [f for f in json_files if f.stem != 'template']
        
        if not json_files:
            print(f"ERREUR Aucun fichier JSON trouve dans {config_dir}")
            sys.exit(1)
        
        print(f"\nGENERATION BATCH de {len(json_files)} pages...")
        print("=" * 50)
        
        for json_file in json_files:
            print(f"\n-> Traitement: {json_file.name}")
            output_path = Path(output_dir) / f"{json_file.stem}.html"
            self.generate(str(json_file), str(output_path))
        
        print("\nOK Generation batch terminee !")


def main():
    """Point d'entrée principal"""
    parser = argparse.ArgumentParser(
        description='Generateur de pages immobilieres professionnelles'
    )
    
    parser.add_argument(
        '-i', '--input',
        required=True,
        help='Fichier JSON de configuration ou dossier pour batch'
    )
    
    parser.add_argument(
        '-o', '--output',
        help='Fichier HTML de sortie (optionnel)'
    )
    
    parser.add_argument(
        '-t', '--template',
        default='src/templates/property.html',
        help='Chemin vers le template HTML (defaut: src/templates/property.html)'
    )
    
    parser.add_argument(
        '-b', '--batch',
        action='store_true',
        help='Mode batch: genere toutes les pages d\'un dossier'
    )
    
    args = parser.parse_args()
    
    # Initialise le générateur
    generator = PropertyGenerator(template_path=args.template)
    
    # Mode batch ou simple
    if args.batch:
        generator.generate_batch(args.input, args.output or 'dist')
    else:
        generator.generate(args.input, args.output)


if __name__ == '__main__':
    main()