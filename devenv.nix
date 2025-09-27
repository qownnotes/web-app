{ pkgs, ... }:

{
  # https://devenv.sh/supported-languages/go/
  languages.go.enable = true;
  # https://devenv.sh/supported-languages/javascript/
  languages.javascript.enable = true;
  languages.javascript.npm.enable = true;

  # https://devenv.sh/packages/
  packages = with pkgs; [
    just
  ];

  enterShell = ''
    echo "🛠️ QOwnNotesWebApp dev shell"
    echo "🐹 Go version: $(go version)"
  '';

  # https://devenv.sh/git-hooks/
  git-hooks.hooks = {
    # https://devenv.sh/reference/options/#git-hookshookstreefmt
    # https://github.com/numtide/treefmt
    # https://github.com/numtide/treefmt-nix
    treefmt = {
      enable = true;
      settings.formatters = with pkgs; [
        nodePackages.prettier
        shfmt
        nixfmt-rfc-style
        statix
        taplo
      ];
    };

    # https://devenv.sh/reference/options/#git-hookshooksdeadnix
    # https://github.com/astro/deadnix
    deadnix = {
      enable = true;
      settings = {
        edit = true; # Allow to edit the file if it is not formatted
      };
    };
  };

  # See full reference at https://devenv.sh/reference/options/
}
