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
import shutil
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
            print(f"✓ Template chargé: {self.template_path}")
            return content
        except FileNotFoundError:
            print(f"✗ Template non trouvé: {self.template_path}")
            sys.exit(1)
        except Exception as e:
            print(f"✗ Erreur lecture template: {e}")
            sys.exit(1)
    
    def _copy_assets(self, output_dir: Path):
        """
        Copie les assets (CSS, JS, images) dans le dossier de sortie
        
        Args:
            output_dir: Dossier de destination
        """
        print("\nCopie des assets...")
        
        # Dossier source
        src_dir = Path('src')
        
        if not src_dir.exists():
            print("⚠ Dossier src/ non trouvé, assets non copiés")
            return
        
        # Dossier destination
        dest_dir = output_dir / 'src'
        
        # Supprime l'ancien dossier si existe
        if dest_dir.exists():
            shutil.rmtree(dest_dir)
        
        # Copie tout le dossier src/
        try:
            shutil.copytree(src_dir, dest_dir)
            print(f"✓ Assets copiés dans {dest_dir}")
        except Exception as e:
            print(f"⚠ Erreur copie assets: {e}")
    
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
            print(f"✓ Configuration chargée: {config_path}")
            return config
        except FileNotFoundError:
            print(f"✗ Fichier JSON non trouvé: {config_path}")
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"✗ JSON invalide: {e}")
            sys.exit(1)
        except Exception as e:
            print(f"✗ Erreur lecture config: {e}")
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
                print(f"✗ Clé requise manquante: {key}")
                return False
        
        # Vérifications spécifiques
        if 'title' not in config['property']:
            print("✗ property.title manquant")
            return False
        
        if 'name' not in config['agency']:
            print("✗ agency.name manquant")
            return False
        
        print("✓ Configuration valide")
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
            parts.append(f"à {prop['location']}")
        
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
        print("\n" + "="*50)
        print("GÉNÉRATION DE LA PAGE")
        print("="*50)
        
        # 1. Charge la config
        config = self.load_config(config_path)
        
        # 2. Valide
        if not self.validate_config(config):
            print("✗ Validation échouée")
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
        
        # 6. Copie les assets (CSS, JS)
        self._copy_assets(output_path.parent)
        
        # 7. Écrit le fichier
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(html)
            print(f"✓ Page générée: {output_path}")
            print("="*50 + "\n")
            return str(output_path)
        except Exception as e:
            print(f"✗ Erreur écriture fichier: {e}")
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
            print(f"✗ Dossier non trouvé: {config_dir}")
            sys.exit(1)
        
        # Trouve tous les JSON
        json_files = list(config_path.glob('*.json'))
        
        # Exclut template.json
        json_files = [f for f in json_files if f.stem != 'template']
        
        if not json_files:
            print(f"✗ Aucun fichier JSON trouvé dans {config_dir}")
            sys.exit(1)
        
        print(f"\nGÉNÉRATION BATCH de {len(json_files)} pages...")
        print("=" * 50)
        
        for json_file in json_files:
            print(f"\n→ Traitement: {json_file.name}")
            output_path = Path(output_dir) / f"{json_file.stem}.html"
            self.generate(str(json_file), str(output_path))
        
        print("\n✓ Génération batch terminée !")


def main():
    """Point d'entrée principal"""
    parser = argparse.ArgumentParser(
        description='Générateur de pages immobilières professionnelles'
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
        help='Chemin vers le template HTML (défaut: src/templates/property.html)'
    )
    
    parser.add_argument(
        '-b', '--batch',
        action='store_true',
        help='Mode batch: génère toutes les pages d\'un dossier'
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